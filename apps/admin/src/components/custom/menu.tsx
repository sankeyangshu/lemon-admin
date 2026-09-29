import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@workspace/web-ui/components/collapsible';
import { Popover, PopoverContent, PopoverTrigger } from '@workspace/web-ui/components/popover';
import { Tooltip, TooltipContent, TooltipTrigger } from '@workspace/web-ui/components/tooltip';
import { cn } from '@workspace/web-ui/lib/utils';
import { createContext, use, useState } from 'react';
import type { CSSProperties, MouseEvent, ReactNode } from 'react';

import SvgIcon from './svg-icon';

const EMPTY_KEYS: string[] = [];
const EMPTY_ITEMS: ItemType[] = [];
/** popup 与触发项 / 相邻 popup 的视觉间距 */
const MENU_POPUP_GAP = 4;
/** 根列表 / 父 popup 的 `p-1`，sideOffset 要补上才不会贴边 */
const MENU_POPUP_PADDING = 4;

export type MenuMode = 'inline' | 'vertical' | 'horizontal';

export interface MenuInfo {
  /** 被点击项的 key */
  key: string;
  /** 从叶子到根的 key 路径 */
  keyPath: string[];
  /** 原生点击事件 */
  domEvent: MouseEvent<HTMLButtonElement>;
  /** 对应的叶子配置 */
  itemData: MenuItemType;
}

export interface MenuSelectInfo extends MenuInfo {
  /** 选中后的 selectedKeys */
  selectedKeys: string[];
}

export interface MenuItemType {
  /** 唯一标识，缺省时用层级下标拼接 */
  key?: string;
  /** 菜单文案 */
  label?: ReactNode;
  /** 左侧图标 */
  icon?: ReactNode;
  /** 禁用后不可点击 */
  disabled?: boolean;
  /** 危险样式 */
  danger?: boolean;
  /** 右侧额外内容 */
  extra?: ReactNode;
  /** 折叠态 Tooltip；缺省时用字符串 label */
  title?: string;
}

export interface SubMenuType {
  /** 唯一标识 */
  key?: string;
  /** 子菜单标题 */
  label?: ReactNode;
  /** 左侧图标 */
  icon?: ReactNode;
  /** 禁用后不可展开 */
  disabled?: boolean;
  /** 折叠态 Tooltip；缺省时用字符串 label */
  title?: string;
  /** 标题右侧额外内容，显示在展开箭头左侧 */
  extra?: ReactNode;
  /** 子项 */
  children?: ItemType[];
  /** 弹出层 class，仅 popup 子菜单生效 */
  popupClassName?: string;
  /** 点击标题（不选中叶子） */
  onTitleClick?: (info: { key: string; domEvent: MouseEvent<HTMLButtonElement> }) => void;
}

export interface MenuItemGroupType {
  /** 分组标记 */
  type: 'group';
  /** 分组标题 */
  label?: ReactNode;
  /** 分组内菜单项 */
  children?: ItemType[];
}

export interface MenuDividerType {
  /** 分割线标记 */
  type: 'divider';
  /** 是否虚线 */
  dashed?: boolean;
}

export type ItemType = MenuItemType | SubMenuType | MenuItemGroupType | MenuDividerType | null;

export interface MenuExpandIconRenderProps {
  /** 子菜单是否展开 */
  isOpen: boolean;
  /** 恒为 true，对齐 antd expandIcon 签名 */
  isSubMenu: boolean;
}

export interface MenuProps {
  /** 菜单数据，支持 item / submenu / group / divider */
  items?: ItemType[];
  /** 布局：inline 手风琴、vertical 右侧弹出、horizontal 顶栏 */
  mode?: MenuMode;
  /** 受控选中项 */
  selectedKeys?: string[];
  /** 非受控初始选中 */
  defaultSelectedKeys?: string[];
  /** 受控展开的子菜单 key */
  openKeys?: string[];
  /** 非受控初始展开 */
  defaultOpenKeys?: string[];
  /** 仅 mode=inline 时生效，折叠为图标 + Tooltip / 弹出子级 */
  inlineCollapsed?: boolean;
  /** inline 每级缩进像素 */
  inlineIndent?: number;
  /** popup 子菜单触发方式 */
  triggerSubMenuAction?: 'hover' | 'click';
  /** 自定义展开箭头 */
  expandIcon?: ReactNode | ((props: MenuExpandIconRenderProps) => ReactNode);
  /** 根节点 class */
  className?: string;
  /** 根节点 style */
  style?: CSSProperties;
  /** 点击叶子 */
  onClick?: (info: MenuInfo) => void;
  /** 选中叶子 */
  onSelect?: (info: MenuSelectInfo) => void;
  /** 展开项变化 */
  onOpenChange?: (openKeys: string[]) => void;
}

interface MenuContextValue {
  /** 根模式 */
  mode: MenuMode;
  /** inline 折叠态 */
  collapsed: boolean;
  /** 子菜单走弹出层（非 inline，或 inline 已折叠） */
  usePopupSubMenu: boolean;
  /** 当前选中 */
  selectedKeys: string[];
  /** 当前展开 */
  openKeys: string[];
  /** inline 缩进 */
  inlineIndent: number;
  /** 弹出触发 */
  triggerSubMenuAction: 'hover' | 'click';
  /** 展开图标 */
  expandIcon: MenuProps['expandIcon'];
  /** 叶子点击 */
  onItemClick: (
    item: MenuItemType,
    keyPathFromRoot: string[],
    event: MouseEvent<HTMLButtonElement>
  ) => void;
  /** 子菜单开合 */
  onSubMenuOpenChange: (key: string, open: boolean) => void;
}

interface MenuListProps {
  /** 当前层 items */
  items: ItemType[];
  /** 当前层级，从 1 开始 */
  level: number;
  /** 祖先 key（根 → 当前） */
  parentKeys: string[];
  /** 当前列表方向 */
  layout: 'horizontal' | 'vertical';
}

interface MenuLeafItemProps {
  /** 叶子配置 */
  item: MenuItemType;
  /** 解析后的 key */
  itemKey: string;
  /** 根 → 当前 */
  keyPath: string[];
  /** 层级 */
  level: number;
  /** 列表方向 */
  layout: 'horizontal' | 'vertical';
}

interface MenuSubItemProps {
  /** 子菜单配置 */
  item: SubMenuType;
  /** 解析后的 key */
  itemKey: string;
  /** 根 → 当前 */
  keyPath: string[];
  /** 层级 */
  level: number;
  /** 列表方向 */
  layout: 'horizontal' | 'vertical';
}

interface MenuGroupItemProps {
  /** 分组配置 */
  item: MenuItemGroupType;
  /** 层级 */
  level: number;
  /** 祖先 key */
  parentKeys: string[];
  /** 列表方向 */
  layout: 'horizontal' | 'vertical';
}

interface MenuDividerItemProps {
  /** 分割线配置 */
  item: MenuDividerType;
  /** 列表方向 */
  layout: 'horizontal' | 'vertical';
}

interface MenuItemButtonProps extends React.ComponentProps<'button'> {
  /** 是否选中叶子 */
  selected?: boolean;
  /** 子菜单下有选中后代 */
  active?: boolean;
  /** 危险样式 */
  danger?: boolean;
  /** 折叠只显示图标 */
  collapsed?: boolean;
  /** 顶栏项 */
  horizontal?: boolean;
  /** inline 缩进 */
  paddingLeft?: number;
  /** 图标 */
  icon?: ReactNode;
  /** 文案 */
  label?: ReactNode;
  /** 右侧 extra */
  extra?: ReactNode;
  /** 展开箭头 */
  expandIcon?: ReactNode;
}

interface MenuExpandIconProps {
  /** 是否展开 */
  isOpen: boolean;
  /** 默认箭头朝向 */
  direction: 'right' | 'down';
  /** inline 展开时箭头转向下 */
  rotateOnOpen?: boolean;
}

interface MenuItemClassNameOptions {
  selected: boolean;
  active: boolean;
  danger: boolean;
  disabled: boolean;
  collapsed: boolean;
  horizontal: boolean;
}

const MenuContext = createContext<MenuContextValue | null>(null);

function isDivider(item: NonNullable<ItemType>): item is MenuDividerType {
  return 'type' in item && item.type === 'divider';
}

function isGroup(item: NonNullable<ItemType>): item is MenuItemGroupType {
  return 'type' in item && item.type === 'group';
}

function isSubMenu(item: NonNullable<ItemType>): item is SubMenuType {
  return !isDivider(item) && !isGroup(item) && Array.isArray((item as SubMenuType).children);
}

function collectChildKeys(items: ItemType[] | undefined): string[] {
  if (!items) return [];

  const keys: string[] = [];

  for (const item of items) {
    if (!item || isDivider(item)) continue;

    if (isGroup(item)) {
      keys.push(...collectChildKeys(item.children));
      continue;
    }

    if (item.key) keys.push(item.key);

    if (isSubMenu(item)) {
      keys.push(...collectChildKeys(item.children));
    }
  }

  return keys;
}

function hasSelectedDescendant(children: ItemType[] | undefined, selectedKeys: string[]): boolean {
  if (!children || selectedKeys.length === 0) return false;

  const selectedSet = new Set(selectedKeys);
  return collectChildKeys(children).some((key) => selectedSet.has(key));
}

function getItemKey(item: MenuItemType | SubMenuType, fallback: string): string {
  return item.key ?? fallback;
}

function getTooltipTitle(item: MenuItemType | SubMenuType): string | undefined {
  if (item.title) return item.title;
  if (typeof item.label === 'string') return item.label;
  return undefined;
}

function getMenuListClassName(layout: 'horizontal' | 'vertical', inset: boolean): string {
  return cn(
    'flex gap-1',
    layout === 'horizontal' ? 'flex-row items-center' : 'flex-col',
    inset && 'p-1'
  );
}

function getMenuItemClassName(options: MenuItemClassNameOptions): string {
  const { selected, active, danger, disabled, collapsed, horizontal } = options;

  return cn(
    'flex cursor-pointer items-center gap-2 rounded-md text-sm outline-none select-none',
    'transition-[background-color,color] duration-200 ease-out',
    'focus-visible:ring-sidebar-ring focus-visible:ring-2',
    collapsed ? 'size-10 justify-center px-0' : 'h-9',
    !collapsed && horizontal && 'w-auto px-3',
    !collapsed && !horizontal && 'w-full px-3',
    selected && 'bg-sidebar-primary text-sidebar-primary-foreground',
    !selected && active && 'bg-sidebar-accent text-sidebar-accent-foreground',
    !selected &&
      !active &&
      !danger &&
      'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
    danger && 'text-destructive hover:bg-destructive/10',
    disabled && 'pointer-events-none opacity-50'
  );
}

function resolveExpandIcon(
  expandIcon: MenuProps['expandIcon'],
  isOpen: boolean,
  direction: 'right' | 'down',
  rotateOnOpen = false
): ReactNode {
  if (typeof expandIcon === 'function') {
    return expandIcon({ isOpen, isSubMenu: true });
  }

  if (expandIcon) return expandIcon;

  return <MenuExpandIcon isOpen={isOpen} direction={direction} rotateOnOpen={rotateOnOpen} />;
}

function useMenuContext(): MenuContextValue {
  const ctx = use(MenuContext);

  if (!ctx) {
    throw new Error('Menu compound parts must be used within Menu');
  }

  return ctx;
}

const MenuExpandIcon = (props: MenuExpandIconProps) => {
  const { isOpen, direction, rotateOnOpen = false } = props;

  return (
    <SvgIcon
      icon="lucide:chevron-right"
      className={cn(
        'ml-auto size-4 shrink-0 transition-transform duration-200',
        direction === 'down' && 'rotate-90',
        rotateOnOpen && isOpen && direction === 'right' && 'rotate-90'
      )}
    />
  );
};

const MenuItemButton = (props: MenuItemButtonProps) => {
  const {
    selected = false,
    active = false,
    danger = false,
    collapsed = false,
    horizontal = false,
    paddingLeft,
    icon,
    label,
    extra,
    expandIcon,
    className,
    disabled,
    style,
    ...rest
  } = props;

  return (
    <button
      type="button"
      disabled={disabled}
      aria-current={selected ? 'page' : undefined}
      className={cn(
        getMenuItemClassName({
          selected,
          active,
          danger,
          disabled: Boolean(disabled),
          collapsed,
          horizontal,
        }),
        className
      )}
      style={{
        paddingLeft: collapsed || horizontal ? undefined : paddingLeft,
        ...style,
      }}
      {...rest}
    >
      {icon ? (
        <span className="flex size-4 shrink-0 items-center justify-center [&_svg]:size-4">
          {icon}
        </span>
      ) : null}
      {collapsed ? null : <span className="min-w-0 flex-1 truncate text-left">{label}</span>}
      {collapsed ? null : extra}
      {collapsed ? null : expandIcon}
    </button>
  );
};

const MenuDividerItem = (props: MenuDividerItemProps) => {
  const { item, layout } = props;

  const isVerticalRule = layout === 'horizontal';

  return (
    <li role="separator" aria-orientation={isVerticalRule ? 'vertical' : 'horizontal'}>
      <div
        className={cn(
          isVerticalRule ? 'h-4 w-px' : 'h-px w-full',
          item.dashed ? 'border-sidebar-border border-dashed bg-transparent' : 'bg-sidebar-border',
          item.dashed && (isVerticalRule ? 'border-l' : 'border-t')
        )}
      />
    </li>
  );
};

const MenuGroupItem = (props: MenuGroupItemProps) => {
  const { item, level, parentKeys, layout } = props;

  const { collapsed, inlineIndent } = useMenuContext();

  if (collapsed) {
    return (
      <MenuList
        items={item.children ?? EMPTY_ITEMS}
        level={level}
        parentKeys={parentKeys}
        layout={layout}
      />
    );
  }

  return (
    <li
      role="none"
      className={layout === 'horizontal' ? 'flex items-center gap-1' : 'mt-2 flex flex-col gap-1'}
    >
      {item.label ? (
        <div
          className={cn('text-muted-foreground px-2 text-xs', layout !== 'horizontal' && 'pt-3')}
          style={layout === 'vertical' ? { paddingLeft: inlineIndent * level } : undefined}
        >
          {item.label}
        </div>
      ) : null}
      <ul role="group" className={getMenuListClassName(layout, false)}>
        <MenuList
          items={item.children ?? EMPTY_ITEMS}
          level={level}
          parentKeys={parentKeys}
          layout={layout}
        />
      </ul>
    </li>
  );
};

const MenuLeafItem = (props: MenuLeafItemProps) => {
  const { item, itemKey, keyPath, level, layout } = props;

  const { collapsed, selectedKeys, inlineIndent, onItemClick } = useMenuContext();

  const selected = selectedKeys.includes(itemKey);
  const tooltipTitle = getTooltipTitle(item);
  const paddingLeft = layout === 'vertical' ? inlineIndent * level : undefined;

  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    if (item.disabled) return;
    onItemClick(item, keyPath, event);
  }

  const button = (
    <MenuItemButton
      selected={selected}
      danger={item.danger}
      disabled={item.disabled}
      collapsed={collapsed}
      horizontal={layout === 'horizontal'}
      paddingLeft={paddingLeft}
      icon={item.icon}
      label={item.label}
      extra={item.extra}
      onClick={handleClick}
    />
  );

  return (
    <li role="none">
      {collapsed && tooltipTitle ? (
        <Tooltip>
          <TooltipTrigger disabled={item.disabled} render={button} />
          <TooltipContent side="right">{tooltipTitle}</TooltipContent>
        </Tooltip>
      ) : (
        button
      )}
    </li>
  );
};

const InlineSubMenu = (props: MenuSubItemProps) => {
  const { item, itemKey, keyPath, level, layout } = props;

  const { collapsed, selectedKeys, openKeys, inlineIndent, expandIcon, onSubMenuOpenChange } =
    useMenuContext();

  const isOpen = openKeys.includes(itemKey);
  const active = hasSelectedDescendant(item.children, selectedKeys);
  const paddingLeft = layout === 'vertical' ? inlineIndent * level : undefined;

  function handleOpenChange(open: boolean) {
    if (item.disabled) return;
    onSubMenuOpenChange(itemKey, open);
  }

  function handleTitleClick(event: MouseEvent<HTMLButtonElement>) {
    item.onTitleClick?.({ key: itemKey, domEvent: event });
  }

  return (
    <li role="none">
      <Collapsible
        className="flex w-full flex-col"
        open={isOpen}
        disabled={item.disabled}
        onOpenChange={handleOpenChange}
      >
        <CollapsibleTrigger
          disabled={item.disabled}
          nativeButton
          render={
            <MenuItemButton
              active={active}
              disabled={item.disabled}
              collapsed={collapsed}
              horizontal={layout === 'horizontal'}
              paddingLeft={paddingLeft}
              icon={item.icon}
              label={item.label}
              extra={item.extra}
              expandIcon={resolveExpandIcon(expandIcon, isOpen, 'right', true)}
              onClick={handleTitleClick}
            />
          }
        />
        <CollapsibleContent className="h-(--collapsible-panel-height) overflow-hidden pt-1 transition-[height] duration-200 ease-out data-ending-style:h-0 data-starting-style:h-0">
          <ul role="menu" className={getMenuListClassName('vertical', false)}>
            <MenuList
              items={item.children ?? EMPTY_ITEMS}
              level={level + 1}
              parentKeys={keyPath}
              layout="vertical"
            />
          </ul>
        </CollapsibleContent>
      </Collapsible>
    </li>
  );
};

const PopupSubMenu = (props: MenuSubItemProps) => {
  const { item, itemKey, keyPath, level, layout } = props;

  const menu = useMenuContext();
  const {
    collapsed,
    selectedKeys,
    openKeys,
    inlineIndent,
    triggerSubMenuAction,
    expandIcon,
    onSubMenuOpenChange,
  } = menu;

  const isOpen = openKeys.includes(itemKey);
  const active = hasSelectedDescendant(item.children, selectedKeys);
  const paddingLeft = layout === 'vertical' && !collapsed ? inlineIndent * level : undefined;
  const popupSide = layout === 'horizontal' ? 'bottom' : 'right';
  // 根 ul / 父 popup 都有 p-1，必须加上才有 4px 视觉缝
  const popupSideOffset = MENU_POPUP_GAP + MENU_POPUP_PADDING;
  const chevronDirection = layout === 'horizontal' ? 'down' : 'right';
  const popupMenu: MenuContextValue = {
    ...menu,
    collapsed: false,
  };

  function handleOpenChange(open: boolean) {
    if (item.disabled) return;
    onSubMenuOpenChange(itemKey, open);
  }

  function handleTitleClick(event: MouseEvent<HTMLButtonElement>) {
    item.onTitleClick?.({ key: itemKey, domEvent: event });
  }

  const trigger = (
    <MenuItemButton
      active={active || isOpen}
      disabled={item.disabled}
      collapsed={collapsed}
      horizontal={layout === 'horizontal'}
      paddingLeft={paddingLeft}
      icon={item.icon}
      label={item.label}
      extra={item.extra}
      expandIcon={resolveExpandIcon(expandIcon, isOpen, chevronDirection)}
      onClick={handleTitleClick}
    />
  );

  return (
    <li role="none">
      <Popover open={isOpen} onOpenChange={handleOpenChange}>
        <PopoverTrigger
          disabled={item.disabled}
          openOnHover={triggerSubMenuAction === 'hover'}
          delay={100}
          closeDelay={150}
          nativeButton
          render={trigger}
        />
        <PopoverContent
          side={popupSide}
          align="start"
          sideOffset={popupSideOffset}
          className={cn(
            'bg-popover text-popover-foreground w-auto min-w-40 p-1',
            item.popupClassName
          )}
        >
          <MenuContext value={popupMenu}>
            <ul role="menu" className={getMenuListClassName('vertical', false)}>
              <MenuList
                items={item.children ?? EMPTY_ITEMS}
                level={1}
                parentKeys={keyPath}
                layout="vertical"
              />
            </ul>
          </MenuContext>
        </PopoverContent>
      </Popover>
    </li>
  );
};

const MenuList = (props: MenuListProps) => {
  const { items, level, parentKeys, layout } = props;

  const { usePopupSubMenu } = useMenuContext();

  return items.map((item, index) => {
    if (!item) return null;

    const fallbackKey = `${parentKeys.join('-') || 'root'}-${index}`;

    if (isDivider(item)) {
      return <MenuDividerItem key={fallbackKey} item={item} layout={layout} />;
    }

    if (isGroup(item)) {
      return (
        <MenuGroupItem
          key={fallbackKey}
          item={item}
          level={level}
          parentKeys={parentKeys}
          layout={layout}
        />
      );
    }

    const itemKey = getItemKey(item, fallbackKey);
    const keyPath = [...parentKeys, itemKey];

    if (isSubMenu(item)) {
      const subProps: MenuSubItemProps = {
        item,
        itemKey,
        keyPath,
        level,
        layout,
      };

      if (usePopupSubMenu) {
        return <PopupSubMenu key={itemKey} {...subProps} />;
      }

      return <InlineSubMenu key={itemKey} {...subProps} />;
    }

    return (
      <MenuLeafItem
        key={itemKey}
        item={item}
        itemKey={itemKey}
        keyPath={keyPath}
        level={level}
        layout={layout}
      />
    );
  });
};

export const Menu = (props: MenuProps) => {
  const {
    items = EMPTY_ITEMS,
    mode = 'inline',
    selectedKeys: selectedKeysProp,
    defaultSelectedKeys = EMPTY_KEYS,
    openKeys: openKeysProp,
    defaultOpenKeys = EMPTY_KEYS,
    inlineCollapsed = false,
    inlineIndent = 24,
    triggerSubMenuAction = 'hover',
    expandIcon,
    className,
    style,
    onClick,
    onSelect,
    onOpenChange,
  } = props;

  const [uncontrolledSelectedKeys, setUncontrolledSelectedKeys] = useState(defaultSelectedKeys);
  const [uncontrolledOpenKeys, setUncontrolledOpenKeys] = useState(defaultOpenKeys);

  const isSelectedControlled = selectedKeysProp !== undefined;
  const isOpenControlled = openKeysProp !== undefined;
  const selectedKeys = isSelectedControlled ? selectedKeysProp : uncontrolledSelectedKeys;
  const baseOpenKeys = isOpenControlled ? (openKeysProp ?? EMPTY_KEYS) : uncontrolledOpenKeys;
  const collapsed = mode === 'inline' && inlineCollapsed;
  const usePopupSubMenu = mode !== 'inline' || collapsed;
  const layout: 'horizontal' | 'vertical' = mode === 'horizontal' ? 'horizontal' : 'vertical';
  // 父级展开项的内容签名。没有父级时 baseOpenKeys 每次都是新数组
  const parentOpenKey = baseOpenKeys.join('\0');
  const [wasCollapsed, setWasCollapsed] = useState(collapsed);
  const [popupOpenKeys, setPopupOpenKeys] = useState<string[] | null>(null);
  const [trackedParentOpenKey, setTrackedParentOpenKey] = useState(parentOpenKey);

  let openKeys = baseOpenKeys;

  // 折叠后的 popup 不继承手风琴展开项，避免 Popover 带着 open 挂上再立刻关掉
  if (collapsed !== wasCollapsed) {
    setWasCollapsed(collapsed);
    setTrackedParentOpenKey(parentOpenKey);
    setPopupOpenKeys(collapsed ? EMPTY_KEYS : null);
    if (collapsed) {
      openKeys = EMPTY_KEYS;
    }
  } else if (collapsed && popupOpenKeys !== null) {
    if (trackedParentOpenKey !== parentOpenKey) {
      setTrackedParentOpenKey(parentOpenKey);
      setPopupOpenKeys(EMPTY_KEYS);
      openKeys = EMPTY_KEYS;
    } else {
      openKeys = popupOpenKeys;
    }
  }

  function handleItemClick(
    item: MenuItemType,
    keyPathFromRoot: string[],
    event: MouseEvent<HTMLButtonElement>
  ) {
    const key = keyPathFromRoot[keyPathFromRoot.length - 1] ?? '';
    const keyPath = keyPathFromRoot.toReversed();
    const info: MenuInfo = { key, keyPath, domEvent: event, itemData: item };

    onClick?.(info);

    if (!isSelectedControlled) {
      setUncontrolledSelectedKeys([key]);
    }

    onSelect?.({ ...info, selectedKeys: [key] });
  }

  function handleSubMenuOpenChange(key: string, open: boolean) {
    const alreadyOpen = openKeys.includes(key);
    if (open && alreadyOpen) return;
    if (!open && !alreadyOpen) return;

    const nextOpenKeys = open ? [...openKeys, key] : openKeys.filter((itemKey) => itemKey !== key);

    if (collapsed) {
      setPopupOpenKeys(nextOpenKeys);
      return;
    }

    if (!isOpenControlled) {
      setUncontrolledOpenKeys(nextOpenKeys);
    }

    onOpenChange?.(nextOpenKeys);
  }

  const contextValue: MenuContextValue = {
    mode,
    collapsed,
    usePopupSubMenu,
    selectedKeys,
    openKeys,
    inlineIndent,
    triggerSubMenuAction,
    expandIcon,
    onItemClick: handleItemClick,
    onSubMenuOpenChange: handleSubMenuOpenChange,
  };

  return (
    <MenuContext value={contextValue}>
      <nav data-slot="menu" className={className} style={style}>
        <ul
          role="menu"
          className={cn(getMenuListClassName(layout, true), collapsed && 'items-center')}
        >
          <MenuList items={items} level={1} parentKeys={[]} layout={layout} />
        </ul>
      </nav>
    </MenuContext>
  );
};
