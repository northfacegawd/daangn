export function classnames(...classnames: string[]) {
  return classnames.join(" ");
}

export function getTitle(pathname: string) {
  let title = "당근마켓";

  if (pathname === "/") {
    title = "홈";
  } else if (pathname.startsWith("/community")) {
    title = "동네생활";
  } else if (pathname.startsWith("/streams")) {
    title = "라이브";
  } else if (pathname.startsWith("/profile")) {
    title = "나의 당근";
  } else if (pathname.startsWith("/chats")) {
    title = "채팅";
  }

  return title;
}

export function hasSubUrl(pathname: string) {
  return pathname.split("/").length > 2;
}

export function footerHidden(pathname: string) {
  let hidden = false;
  if (
    (pathname.startsWith("/chats") || pathname.startsWith("/streams")) &&
    hasSubUrl(pathname)
  ) {
    hidden = true;
  }
  if (pathname.startsWith("/enter")) {
    hidden = true;
  }
  return hidden;
}

export function getImageUrl(imageId: string, variant = "public") {
  return `https://imagedelivery.net/8L5VksWFNcCtvLePLh5r8Q/${imageId}/${variant}`;
}
