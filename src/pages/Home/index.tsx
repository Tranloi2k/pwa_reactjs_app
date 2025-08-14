import { useEffect, useState } from "react";
import landscape from "../../assets/landscape.webp";
import landscapeSmall from "../../assets/landscape_small.webp";
import { add } from "../../common/math";
import { Link } from "react-router-dom";
import axiosInstance from "../../config/axios";

const Home = () => {
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    const fetchProtectedData = async () => {
      try {
        const response = await axiosInstance.get("/products");
        console.log(response);
        setMessage(response.data);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        setMessage("Access denied: " + (error.response?.data || error.message));
      }
    };

    fetchProtectedData();
  }, []);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        // Kiểm tra quyền thông báo trước khi gửi
        if (
          Notification.permission === "granted" &&
          navigator.serviceWorker?.controller
        ) {
          navigator.serviceWorker.controller.postMessage({
            type: "TAB_HIDDEN",
            title: "Hey, come back!",
            body: "Bạn đang bỏ lỡ nội dung hấp dẫn 😉",
          });
        }
      }
    };

    // Yêu cầu quyền thông báo khi component mount
    const requestNotificationPermission = async () => {
      if ("Notification" in window) {
        await Notification.requestPermission();
      }
    };

    requestNotificationPermission();
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    const requestPermission = async () => {
      const permission = await Notification.requestPermission();
      console.log("Notification permission:", permission);
    };
    requestPermission();
  }, []);

  return (
    <div>
      <p>{message}</p>

      <picture>
        <source
          srcSet={landscape}
          media="(min-width: 800px)"
          type="image/webp"
          className="w-[600px]"
        />
        {/* <source srcSet="image-large.jpg" media="(min-width: 800px)" type="image/jpeg" /> */}
        <source
          srcSet={landscapeSmall}
          media="(max-width: 799px)"
          type="image/webp"
        />
        {/* <source srcSet="image-small.jpg" media="(max-width: 799px)" type="image/jpeg" /> */}
        <img
          src={landscape}
          alt="ảnh landscape"
          style={{ maxWidth: "600px" }}
        />
      </picture>
      <h1>Hello World!</h1>
      <p>{add(1, 2)}</p>
      <Link to={"/about"}>about</Link>
    </div>
  );
};

export default Home;
