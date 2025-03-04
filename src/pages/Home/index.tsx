import landscape from "../../assets/landscape.webp"
import landscapeSmall from "../../assets/landscape_small.webp"
import { add } from "../../common/math";
import { Link } from "react-router-dom";

const Home = () => {

  return (
    <div>
      <picture>
        <source srcSet={landscape} media="(min-width: 800px)" type="image/webp" className="w-[600px]"/>
        {/* <source srcSet="image-large.jpg" media="(min-width: 800px)" type="image/jpeg" /> */}
        <source srcSet={landscapeSmall} media="(max-width: 799px)" type="image/webp" />
        {/* <source srcSet="image-small.jpg" media="(max-width: 799px)" type="image/jpeg" /> */}
        <img src={landscape} alt="ảnh landscape" style={{maxWidth: '600px'}}/>
      </picture>
      <h1>Hello World!</h1>
      <p>{add(1, 2)}</p>
      <Link to={'/about'}>about</Link>
    </div>
  );
};

export default Home;
