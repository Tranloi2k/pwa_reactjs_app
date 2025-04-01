import path from "path";
import TerserPlugin from "terser-webpack-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";
import { InjectManifest } from "workbox-webpack-plugin";
import CopyWebpackPlugin from "copy-webpack-plugin";
import { fileURLToPath } from "url";
import Dotenv from "dotenv-webpack";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  entry: {
    app: path.resolve("src/index"),
    // serviceWorker: path.resolve("public/service-worker.js"),
  }, // Đảm bảo rằng điểm vào là tệp TypeScript
  devServer: {
    historyApiFallback: true, // Thêm dòng này
    compress: true,
    port: 8080, // Hoặc cổng bạn muốn
  },
  output: {
    filename: "[name].[contenthash].js",
    path: path.resolve(__dirname, "dist"),
    publicPath: "/",
    clean: true,
  },
  resolve: {
    alias: {
      "@pages": path.resolve(__dirname, "src/pages/"),
      "@store": path.resolve(__dirname, "src/store/"),
    },
    extensions: [".ts", ".tsx"], // Thêm các đuôi file cần thiết
  },

  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: "ts-loader", // Sử dụng ts-loader để biên dịch TypeScript
      },
      {
        test: /\.(png|jpe?g|gif|svg|webp)$/i, // Các tệp hình ảnh
        use: [
          {
            loader: "file-loader", // Sử dụng file-loader
            options: {
              name: "[path][name].[ext]", // Cấu hình tên tệp
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx"], // Thêm các phần mở rộng
  },
  optimization: {
    // splitChunks: {
    //   chunks: "all",
    // },
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: false, // Loại bỏ console.log
          },
          mangle: false, // Làm rối tên biến
          output: {
            comments: false, // Loại bỏ comment
          },
        },
        extractComments: false,
      }),
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "Progressive Web Application",
      template: path.join("public", "index.html"),
      minify: {
        removeComments: true, // Loại bỏ comment
        collapseWhitespace: true, // Nén khoảng trắng
        removeAttributeQuotes: true, // Loại bỏ dấu nháy quanh thuộc tính
        minifyCSS: true, // Nén CSS
      },
    }),
    // new WorkboxPlugin.GenerateSW({
    //   // these options encourage the ServiceWorkers to get in there fast
    //   // and not allow any straggling "old" SWs to hang around
    //   clientsClaim: true,
    //   skipWaiting: true,
    //   include: [/\.html$/, /\.js$/, /\.css$/, /\.png$/, /\.webp$/, /\.svg$/],
    // }),
    new InjectManifest({
      swSrc: "./src/serviceWorker.js", // Đường dẫn đến file Service Worker gốc
      swDest: "service-worker.js", // Tên file Service Worker đầu ra
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: "public/manifest.json", to: "manifest.json" }, // Sao chép manifest.json
        { from: "public/icons", to: "icons" }, // Sao chép thư mục icons (nếu có)
      ],
    }),
    new Dotenv(), // Load biến từ file .env
  ],
  devtool: "source-map",
  mode: "production",
};
