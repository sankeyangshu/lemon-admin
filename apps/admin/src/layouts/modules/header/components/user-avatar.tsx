import { useTranslation } from '@workspace/web-i18n';
import { Avatar, AvatarFallback, AvatarImage } from '@workspace/web-ui/components/avatar';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@workspace/web-ui/components/hover-card';

import SvgIcon from '@/components/custom/svg-icon';

const UserAvatar = () => {
  const { t } = useTranslation();

  const options = [
    {
      key: 'user-center',
      icon: 'mdi:account-outline',
      label: t('theme.header.user.userCenter'),
    },
    {
      key: 'docs',
      icon: 'mdi:book-open-variant-outline',
      label: t('theme.header.user.docs'),
    },
    {
      key: 'github',
      icon: 'mdi:github',
      label: t('theme.header.user.github'),
    },
    {
      key: 'lock-screen',
      icon: 'mdi:lock-outline',
      label: t('theme.header.user.lockScreen'),
    },
  ];

  return (
    <HoverCard>
      <HoverCardTrigger
        delay={10}
        closeDelay={100}
        render={
          <Avatar className="mr-5">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        }
      />
      <HoverCardContent>
        <div className="flex items-center pb-1">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="ml-3 h-full flex-1">
            <span className="text-foreground block truncate text-sm font-medium">Admin</span>
            <span className="mt-0.5 block truncate text-xs text-gray-500">xxx@example.com</span>
          </div>
        </div>
        <ul className="border-border mt-3 border-t pt-4">
          {options.map((option) => (
            <li
              key={option.key}
              className="hover:bg-muted hover:text-foreground dark:hover:bg-muted/50 mb-3 flex cursor-pointer items-center rounded-md p-2 select-none last:mb-0"
            >
              <SvgIcon icon={option.icon} className="mr-2 text-base" />
              <span className="text-sm">{option.label}</span>
            </li>
          ))}

          <div className="bg-border my-2 h-px w-full" />
          <div className="border-border mt-5 cursor-pointer rounded-md border py-1.5 text-center text-xs transition-all duration-200 hover:shadow-xl">
            {t('login.logout')}
          </div>
        </ul>
      </HoverCardContent>
    </HoverCard>
  );
};

export default UserAvatar;
