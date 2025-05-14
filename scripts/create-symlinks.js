const fs = require("fs");
const path = require("path");

const links = [
  { target: "app-shared/android", path: "android" },
  { target: "app-shared/ios", path: "ios" },
  { target: "app-shared/dist", path: "dist" },
  { target: "app-shared/AppCode.js", path: "AppCode.js" },
];

links.forEach(({ target, path: linkPath }) => {
  const fullLinkPath = path.resolve(__dirname, "..", linkPath);
  const fullTargetPath = path.resolve(__dirname, "..", target);

  if (!fs.existsSync(fullTargetPath)) {
    console.warn(`⚠️  Target path does not exist: ${target}`);
    return;
  }

  if (fs.existsSync(fullLinkPath)) {
    console.log(`Removing existing ${linkPath}`);
    fs.rmSync(fullLinkPath, { recursive: true, force: true });
  }

  const isDir = fs.lstatSync(fullTargetPath).isDirectory();
  const symlinkType = isDir ? "junction" : "file";

  console.log(`Creating symlink: ${linkPath} -> ${target} (${symlinkType})`);
  fs.symlinkSync(fullTargetPath, fullLinkPath, symlinkType);
});

console.log("✅ Symlinks created.");
