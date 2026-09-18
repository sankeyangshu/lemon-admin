import { Button } from '@workspace/web-ui/components/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@workspace/web-ui/components/dropdown-menu';
import { cn } from '@workspace/web-ui/lib/utils';

import { useLocale } from '@/core/locale';

import SvgIcon from './svg-icon';

interface LocalePickerProps {
  /** 类名 */
  className?: string;
}

const LocalePicker = (props: LocalePickerProps) => {
  const { className } = props;

  const { locale, localeOptions, setLocale } = useLocale();

  function handleValueChange(value: App.I18n.LangType) {
    setLocale(value);
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="ghost" className="cursor-pointer">
            <SvgIcon icon="mdi:translate" className={cn('size-6', className)} />
          </Button>
        }
      />
      <DropdownMenuContent align="end" className="w-auto min-w-32">
        <DropdownMenuGroup>
          <DropdownMenuRadioGroup value={locale} onValueChange={handleValueChange}>
            {localeOptions.map((option) => (
              <DropdownMenuRadioItem key={option.value} value={option.value} closeOnClick>
                {option.text}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LocalePicker;
