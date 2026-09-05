/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
};

export default nextConfig;

//这是next的配置文件，在构建时，出来的包不再是.next而是out
//也就是静态模式部署，而不是全栈