import { useTranslation } from '@workspace/web-i18n';

function GlobalLoading() {
  const { t } = useTranslation();

  return (
    <div className="fixed top-0 left-0 flex size-full flex-col items-center justify-center">
      <style>
        {`
          @keyframes jump-loader {
            15% { border-bottom-right-radius: 3px; }
            25% { transform: translateY(9px) rotate(22.5deg); }
            50% { transform: translateY(18px) scale(1, 0.9) rotate(45deg); border-bottom-right-radius: 40px; }
            75% { transform: translateY(9px) rotate(67.5deg); }
            100% { transform: translateY(0) rotate(90deg); }
          }
          @keyframes shadow-loader {
            0%, 100% { transform: scale(1, 1); }
            50% { transform: scale(1.2, 1); }
          }
        `}
      </style>
      <div className="relative mx-auto my-9 size-12">
        <div className="bg-primary absolute inset-0 animate-[jump-loader_0.5s_linear_infinite] rounded-sm" />
        <div className="bg-primary/30 absolute top-15 left-0 h-1.25 w-12 animate-[shadow-loader_0.5s_linear_infinite] rounded-[50%]" />
      </div>
      <div className="text-primary/80 text-2xl font-medium">{t('system.title')}</div>
    </div>
  );
}

export default GlobalLoading;
