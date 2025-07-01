declare module "react-router-hash-link" {
  import * as React from "react";
  import { LinkProps } from "react-router-dom";

  export interface HashLinkProps extends LinkProps {
    smooth?: boolean;
    scroll?: (element: HTMLElement) => void;
  }

  export const HashLink: React.FC<HashLinkProps>;
  export const NavHashLink: React.FC<HashLinkProps>;
}
