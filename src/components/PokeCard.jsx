import { getFullPokedexNumber, getPokedexNumber } from "../utils";
import { Header } from "./Header";
import { useEffect, useState } from "react";
import { TypeCard } from "./TypeCard";

export function PokeCard(props) {
  const { selectedPokemon } = props;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const { name, height, abilities, stats, types, moves, sprites } = data || {};

  useEffect(() => {
    if (loading || !localStorage) {
      return;
    }

    let cache = {};

    if (localStorage.getItem("pokedex")) {
      cache = JSON.parse(localStorage.getItem("pokedex"));
    }

    if (selectedPokemon in cache) {
      setData(cache[selectedPokemon]);
      return;
    }

    //if data fetching from the cache fails let's do it from the api

    async function fetchPokemonData() {
      setLoading(true);
      try {
        const baseUrl = "https://pokeapi.co/api/v2/";
        const suffix = "pokemon/" + getPokedexNumber(selectedPokemon);
        const finalUrl = baseUrl + suffix;

        const res = await fetch(finalUrl);

        const pokemonData = await res.json();
        setData(pokemonData);

        cache[selectedPokemon] = pokemonData;
        localStorage.setItem("pokedex", JSON.stringify(cache));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchPokemonData();
  }, [selectedPokemon]);
  if (loading || !data) {
    return (
      <div>
        <h4>loading...</h4>
      </div>
    );
  }
  return (
    <div className="poke-card">
      <div>
        <h4>#{getFullPokedexNumber(selectedPokemon)}</h4>
      </div>
      <div className="type-container">
        {types.map((typeObj, typeIndex) => {
          return <TypeCard key={typeIndex} type={typeObj?.typ?.name} />;
        })}
      </div>
      <img
        className="default-img"
        src={"/pokemon/" + getFullPokedexNumber(selectedPokemon) + ".png"}
      />
    </div>
  );
}
