// This is your config file, place any global data here.
// You can import this data from anywhere in your site by using the `import` keyword.

type Config = {
  title: string;
  description: string;
  lang: string;
  profile: {
    author: string;
    description?: string;
  }
}

type SocialLink = {
  icon: string;
  friendlyName: string; // for accessibility
  link: string;
}

export const siteConfig: Config = {
  title: "CodeHive",
  description: "A tech blog by Honey Sharma covering software development, programming tutorials, and insights into the latest technologies. Learn about web development, coding best practices, and emerging tech trends.",
  lang: "en-GB",
  profile: {
    author: "Honey Sharma",
    description: "Software Engineer and Tech Blogger passionate about sharing knowledge and exploring the latest in technology."
  }
}

/** 
  These are you social media links. 
  It uses https://github.com/natemoo-re/astro-icon#readme
  You can find icons @ https://icones.js.org/
*/
export const socialLinks: Array<SocialLink> = [
  {
    icon: "mdi:github",
    friendlyName: "Github",
    link: "https://github.com/honeycoder96",
  },
  {
    icon: "mdi:linkedin",
    friendlyName: "LinkedIn",
    link: "https://www.linkedin.com/in/honeycoder96/",
  },
  {
    icon: "mdi:email",
    friendlyName: "email",
    link: "mailto:contact@honeyhimself.com",
  },
  {
    icon: "mdi:rss",
    friendlyName: "rss",
    link: "/rss.xml"
  }
];

export const NAV_LINKS: Array<{ title: string, path: string }> = [
  {
    title: "Home",
    path: "/",
  },
  {
    title: "Blog",
    path: "/blog",
  },
  {
    title: "Series",
    path: "/series",
  },
  // {
  //   title: "Projects",
  //   path: '/projects'
  // },
  {
    title: "Contact me",
    path: "/contact",
  },
  // {
  //   title: "Archive",
  //   path: '/archive'
  // }
];
