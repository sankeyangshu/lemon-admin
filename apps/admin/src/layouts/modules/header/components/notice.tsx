import { useTranslation } from '@workspace/web-i18n';
import { Button } from '@workspace/web-ui/components/button';
import { Popover, PopoverContent, PopoverTrigger } from '@workspace/web-ui/components/popover';
import { cn } from '@workspace/web-ui/lib/utils';
import { useState } from 'react';

import SvgIcon from '@/components/custom/svg-icon';

interface NoticeProps {
  /** 类名 */
  className?: string;
}

interface NoticeItem {
  /** 标题 */
  title: string;
  /** 时间 */
  time: string;
  /** 类型 */
  type: 'email' | 'message' | 'follow' | 'user' | 'notice';
}

const NOTICE_STYLE_MAP: Record<NoticeItem['type'], { icon: string; iconClass: string }> = {
  email: {
    icon: 'mdi:email-outline',
    iconClass: 'bg-yellow-500/12 text-yellow-500',
  },
  message: {
    icon: 'mdi:message-outline',
    iconClass: 'bg-green-500/12 text-green-500',
  },
  follow: {
    icon: 'mdi:cards-heart-outline',
    iconClass: 'bg-red-500/12 text-red-500',
  },
  user: {
    icon: 'mdi:account-outline',
    iconClass: 'bg-gray-500/12 text-gray-500',
  },
  notice: {
    icon: 'mdi:bell-outline',
    iconClass: 'bg-blue-500/12 text-blue-500',
  },
};

const NOTICE_LIST: NoticeItem[] = [
  {
    title: '这是一个通知',
    time: '2022-12-31',
    type: 'notice',
  },
  {
    title: '你有1封未读邮件',
    time: '2023-01-01',
    type: 'email',
  },
  {
    title: '你有1条未读消息',
    time: '2024-02-15',
    type: 'message',
  },
  {
    title: '用户xxx关注你了',
    time: '2025-03-20',
    type: 'follow',
  },
  {
    title: '新增了一个用户xxx',
    time: '2025-07-20',
    type: 'user',
  },
  {
    title: '这是一条通知2',
    time: '2026-01-20',
    type: 'notice',
  },
];

const Notice = (props: NoticeProps) => {
  const { className } = props;

  const { t } = useTranslation();
  const [activeIndex, setActiveIndex] = useState(0);

  const noticeBarList = [
    {
      key: 'notice',
      name: t('theme.header.notice.title'),
      num: 6,
    },
    {
      key: 'info',
      name: t('theme.header.notice.info'),
      num: 0,
    },
    {
      key: 'todo',
      name: t('theme.header.notice.todo'),
      num: 0,
    },
  ];

  function handleBarClick(index: number) {
    setActiveIndex(index);
  }

  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button variant="ghost" className="cursor-pointer">
            <SvgIcon icon="line-md:bell-loop" className={cn('size-6!', className)} />
          </Button>
        }
      />
      <PopoverContent className="flex h-125 w-90 flex-col gap-0! overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="text-base font-medium">{t('theme.header.notice.title')}</div>
          <SvgIcon icon="lucide:brush-cleaning" className="text-muted-foreground size-4" />
        </div>

        <ul className="box-border flex h-12.5 w-full items-end gap-5 border-b px-3.5">
          {noticeBarList.map((item, index) => (
            <li
              key={item.key}
              className={cn(
                `text-muted-foreground h-12 cursor-pointer overflow-hidden text-sm/12 select-none`,
                activeIndex === index && 'border-b-2 border-primary text-primary'
              )}
              onClick={() => handleBarClick(index)}
            >
              {item.name}
              <span className="ml-1">({item.num})</span>
            </li>
          ))}
        </ul>

        <div className="w-full flex-1 overflow-y-auto">
          {/* 通知 */}
          {activeIndex === 0
            ? NOTICE_LIST.map((item) => {
                const noticeStyle = NOTICE_STYLE_MAP[item.type];

                return (
                  <div
                    key={item.title}
                    className="hover:bg-accent hover:text-accent-foreground box-border flex cursor-pointer items-center p-3.5"
                  >
                    <div
                      className={cn(
                        'flex size-9 items-center justify-center rounded-lg text-center',
                        noticeStyle.iconClass
                      )}
                    >
                      <SvgIcon className="bg-transparent! text-lg" icon={noticeStyle.icon} />
                    </div>
                    <div className="ml-3 flex-1">
                      <div className="text-sm font-normal">{item.title}</div>
                      <div className="text-muted-foreground mt-1.5 text-xs">{item.time}</div>
                    </div>
                  </div>
                );
              })
            : null}

          {/* 消息 */}
          {activeIndex === 1 ? (
            <div className="text-muted-foreground flex size-full flex-col items-center justify-center">
              <SvgIcon icon="mdi:inbox" className="text-5xl" />
              <div className="mt-3.5 text-sm">{t('theme.header.notice.not')}</div>
            </div>
          ) : null}

          {/* 待办 */}
          {activeIndex === 2 ? (
            <div className="text-muted-foreground flex size-full flex-col items-center justify-center">
              <SvgIcon icon="mdi:inbox" className="text-5xl" />
              <div className="mt-3.5 text-sm">{t('theme.header.notice.not')}</div>
            </div>
          ) : null}
        </div>

        <Button variant="outline" className="mt-3 w-full">
          {t('theme.header.notice.all')}
        </Button>
      </PopoverContent>
    </Popover>
  );
};

export default Notice;
