
import Banner from "./Banner/page";
import FeaturedRecipes from "./Featured.jsx/page";
import PopularRecipes from "./PopularRecipe/page";

export default function HomePage() {
  return (
    <>
      <Banner />
      <FeaturedRecipes />
      <PopularRecipes />
    </>
  );
}