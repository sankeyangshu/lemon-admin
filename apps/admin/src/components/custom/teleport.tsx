import { useIsomorphicLayoutEffect } from '@reactuses/core';
import { isBrowser, isNil, isNotNil, isString } from 'es-toolkit/predicate';
import { attempt } from 'es-toolkit/util';
import { type ReactNode, useState } from 'react';
import { createPortal } from 'react-dom';

export interface TeleportProps {
  /**
   * 目标容器
   * - CSS 选择器：`#id`、`.class`、`body`
   * - 已经挂在文档上的 HTMLElement
   * - 还没有目标时传 null
   */
  to: string | HTMLElement | null;
  /**
   * 当值为 `true` 时，内容将保留在其原始位置
   * 而不是移动到目标容器中
   */
  disabled?: boolean;
  /**
   * 要渲染的内容
   */
  children: ReactNode;
  /**
   * 目标还不存在时渲染的内容，默认不渲染
   */
  fallback?: ReactNode;
  /**
   * 目标不存在时创建，最后一个使用者卸载后删除。
   * 只接受 `#id`，`.class`、`body` 这种选择器不会被创建
   */
  autoCreate?: boolean;
  /**
   * autoCreate 时创建的标签，默认 div
   */
  tagName?: keyof HTMLElementTagNameMap;
}

const owners = new WeakMap<HTMLElement, number>();

type ResolvedTarget =
  | { element: HTMLElement; owned: true }
  | { element: HTMLElement | null; owned: false };

const EMPTY_TARGET: ResolvedTarget = { element: null, owned: false };

const Teleport = (props: TeleportProps) => {
  const {
    autoCreate = false,
    children,
    disabled = false,
    fallback = null,
    tagName = 'div',
    to,
  } = props;

  const [target, setTarget] = useState<HTMLElement | null>(null);

  const activeTarget = isNotNil(target) && target.isConnected ? target : null;

  useIsomorphicLayoutEffect(() => {
    if (disabled) {
      return () => {};
    }

    const resolved = resolveTarget(to, autoCreate, tagName);

    setTarget(resolved.element);

    return () => {
      if (resolved.owned) {
        release(resolved.element);
      }
    };
  }, [autoCreate, disabled, tagName, to]);

  if (disabled) {
    return children;
  }

  if (isNil(activeTarget)) {
    return fallback;
  }

  return createPortal(children, activeTarget);
};

function resolveTarget(
  to: string | HTMLElement | null,
  autoCreate: boolean,
  tagName: keyof HTMLElementTagNameMap
): ResolvedTarget {
  if (!isBrowser()) {
    return EMPTY_TARGET;
  }

  if (isHTMLElement(to)) {
    return to.isConnected ? { element: to, owned: false } : EMPTY_TARGET;
  }

  if (!isString(to) || to.length === 0) {
    return EMPTY_TARGET;
  }

  const existing = findElement(to);

  if (isNotNil(existing)) {
    if ((owners.get(existing) ?? 0) > 0) {
      retain(existing);

      return { element: existing, owned: true };
    }

    return { element: existing, owned: false };
  }

  const id = parseHashId(to);

  if (!autoCreate || isNil(id)) {
    return EMPTY_TARGET;
  }

  const element = document.createElement(tagName);
  element.id = id;
  document.body.appendChild(element);
  retain(element);

  return { element, owned: true };
}

function findElement(to: string) {
  const id = parseHashId(to);

  if (isNotNil(id)) {
    return document.getElementById(id);
  }

  return queryElement(to);
}

function parseHashId(to: string) {
  if (!to.startsWith('#')) {
    return null;
  }

  const id = to.slice(1);

  if (id.length === 0) {
    return null;
  }

  return id;
}

function queryElement(selector: string) {
  const [_, element] = attempt(() => document.querySelector<HTMLElement>(selector));

  return element;
}

function isHTMLElement(value: unknown): value is HTMLElement {
  return typeof HTMLElement !== 'undefined' && value instanceof HTMLElement;
}

function retain(element: HTMLElement) {
  owners.set(element, (owners.get(element) ?? 0) + 1);
}

function release(element: HTMLElement) {
  const next = (owners.get(element) ?? 0) - 1;

  if (next > 0) {
    owners.set(element, next);
    return;
  }

  owners.delete(element);
  element.remove();
}

export default Teleport;
