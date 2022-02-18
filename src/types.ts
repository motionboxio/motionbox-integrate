export interface IVideo {
  duration: number;
  height: number;
  image: string;
  url: string;
  video_files: {
    file_type: string;
    height: number;
    link: string;
    quality: string;
    width: number;
  }[];
  video_pictures: {
    picture: string;
  }[];
  width: number;
}

export interface IUIConfig {
  dashboard: boolean;
  header: {
    avatars: boolean;
    sharing: boolean;
  };
  sidebar: {
    logo: boolean;
    active: string;
    templates: boolean;
    photos: boolean;
    videos: IVideo[][] | boolean;
    elements: boolean;
    text: boolean;
    uploads: boolean;
  };
}

export interface IOptions {
  env?: "production" | "staging" | "development";
  onDone?: (args: any) => void;
  token: string;
  userId: string;
  uiConfig: IUIConfig;
}
