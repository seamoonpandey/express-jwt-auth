import { Request, Response, NextFunction } from "express";

const multipartMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const contentType = req.headers["content-type"];
  if (contentType && contentType.includes("multipart/form-data")) {
    const boundary = contentType.split("boundary=")[1];
    let body = "";

    req.on("data", (chunk: Buffer) => {
      body += chunk.toString();
    });

    req.on("end", () => {
      const parts = body
        .split(`--${boundary}`)
        .filter((part) => part !== "" && part !== "--\r\n");
      const parsedBody: { [key: string]: string } = {};
      parts.forEach((part) => {
        const [header, value] = part.split("\r\n\r\n");
        const nameMatch = header.match(/name="([^"]+)"/);
        if (nameMatch) {
          const name = nameMatch[1];
          parsedBody[name] = value.trim();
        }
      });
      req.body = parsedBody;
      next();
    });
  } else {
    next();
  }
};

export default multipartMiddleware;
