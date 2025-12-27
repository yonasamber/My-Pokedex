import { Header } from "./Header";
import { first151Pokemon, getFullPokedexNumber } from "../utils";
import { useState } from "react";
export function SideNav(props) {
  const { selectedPokemon, setSelectedPokemon, handleCloseMenu, showSideMenu } =
    props;

  const [searchValue, setSearchValue] = useState("");
  const filteredPokemon = first151Pokemon.filter((ele, eleIndex) => {
    if (getFullPokedexNumber(eleIndex).includes(searchValue)) {
      return true;
    }

    if (ele.toLowerCase().includes(searchValue.toLowerCase())) {
      return true;
    }
  });

  return (
    <nav className={" " + (!showSideMenu ? " open" : "")}>
      <div className={"header" + (!showSideMenu ? " open" : "")}>
        <button className="open-nav-button" onClick={handleCloseMenu}>
          <i className="fa-solid fa-arrow-left"></i>
        </button>
        <h1 className="text-gradient">Pokédex</h1>
      </div>
      <input
        placeholder="E.g. 001 0r bulba.."
        value={searchValue}
        onChange={(e) => {
          const result = e.target.value;
          setSearchValue(result);
        }}
      />
      {filteredPokemon.map((pokemon, pokemonIndex) => {
        const truePokedexNumber = first151Pokemon.indexOf(pokemon);
        return (
          <button
            className={
              "nav-card " +
              (selectedPokemon === pokemonIndex ? "nav-card-selected" : " ")
            }
            key={pokemonIndex}
            onClick={() => {
              setSelectedPokemon(truePokedexNumber);
              handleCloseMenu();
            }}
          >
            <p>{getFullPokedexNumber(truePokedexNumber)}</p>
            <p>{pokemon}</p>
          </button>
        );
      })}
    </nav>
  );
}
