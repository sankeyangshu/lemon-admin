import ThemeColor from './theme-color';
import ThemeRadius from './theme-radius';
import ThemeSchema from './theme-schema';

const Appearance = () => {
  return (
    <div className="flex flex-col items-stretch gap-4">
      <ThemeSchema />
      <ThemeColor />
      <ThemeRadius />
    </div>
  );
};

export default Appearance;
