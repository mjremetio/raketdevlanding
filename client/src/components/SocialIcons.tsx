type SocialIconsProps = {
  variant?: 'default' | 'footer';
};

export function SocialIcons({ variant = 'default' }: SocialIconsProps) {
  const socialLinks = [
    { icon: 'fab fa-facebook-f', href: '#' },
    { icon: 'fab fa-twitter', href: '#' },
    { icon: 'fab fa-linkedin-in', href: '#' },
    { icon: 'fab fa-instagram', href: '#' }
  ];

  if (variant === 'default') {
    return (
      <div className="flex space-x-4">
        {socialLinks.map((social, index) => (
          <a 
            key={index}
            href={social.href} 
            className="w-10 h-10 rounded-full bg-foreground dark:bg-accent text-background dark:text-accent-foreground flex items-center justify-center hover:opacity-90 transition-opacity"
            aria-label={`Visit our ${social.icon.replace('fab fa-', '').replace('-', ' ')} page`}
          >
            <i className={social.icon}></i>
          </a>
        ))}
      </div>
    );
  }

  return (
    <div className="flex space-x-4">
      {socialLinks.map((social, index) => (
        <a 
          key={index}
          href={social.href} 
          className="text-gray-300 hover:text-accent transition-colors"
          aria-label={`Visit our ${social.icon.replace('fab fa-', '').replace('-', ' ')} page`}
        >
          <i className={social.icon}></i>
        </a>
      ))}
    </div>
  );
}
