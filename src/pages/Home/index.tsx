import { useEffect } from "react";
import landscape from "../../../public/assets/landscape.webp"
import { add } from "../../common/math";
import { Link } from "react-router-dom";

const Home = () => {
   useEffect(() => {
      const img = new Image();
      img.src = landscape;
    }, []);

  return (
    <div>
      <img src={landscape} alt="landscape" width="600" height="300" />
      <h1>Hello World!</h1>
      <p>{add(1, 2)}</p>
      <Link to={'/about'}>about</Link>
    </div>
  );
};

export default Home;
