export function classnames(...classnames: string[]) {
  return classnames.join(" ");
}

export function getTitle(pathname: string) {
  let title = "당근마켓";

  if (pathname === "/") {
    title = "홈";
  } else if (pathname.startsWith("/community")) {
    title = "동네생활";
  } else if (pathname.startsWith("/live")) {
    title = "라이브";
  } else if (pathname.startsWith("/profile")) {
    title = "나의 당근";
  } else if (pathname.startsWith("/chats")) {
    title = "채팅";
  }

  return title;
}

export function hasSubUrl(pathname: string) {
  return pathname.split("/").length > 1;
}
