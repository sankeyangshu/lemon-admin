function Footer() {
  return (
    <div className="bg-sidebar flex h-full items-center justify-center">
      <span
        className="hover:text-primary cursor-pointer transition-colors duration-300"
        onClick={() =>
          window.open(
            'https://github.com/sankeyangshu/lemon-admin-react/blob/main/LICENSE',
            '_blank',
            'noopener,noreferrer'
          )
        }
      >
        Copyright MIT © 2022-PRESENT sankeyangshu
      </span>
    </div>
  );
}

export default Footer;
