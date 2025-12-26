import { getFullPokedexNumber, getPokedexNumber } from "../utils";
import { Header } from "./Header";
import { useEffect, useState } from "react";
import { TypeCard } from "./TypeCard";
import { Modal } from "./Modal";

export function PokeCard(props) {
  const { selectedPokemon } = props;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [skill, setSkill] = useState(null);
  const [loadingSkill, setLoadingSkill] = useState(false);

  const { name, height, abilities, stats, types, moves, sprites } = data || {};

  const imgList = Object.keys(sprites || {}).filter((val) => {
    if (!sprites[val]) {
      return false;
    }
    if (["versions", "other"].includes(val)) {
      return false;
    }
    return true;
  });

  async function fetchMoveData(move, moveUrl) {
    if (loadingSkill || !localStorage || !moveUrl) {
      retun;
    }

    let c = {};

    if (localStorage.getItem("pokemon-moves")) {
      c = JSON.parse(localStorage.getItem("pokemon-moves"));
    }

    if (move in c) {
      setSkill(c[move]);
      console.log("fond move in c");
      return;
    }

    try {
      setLoadingSkill(true);
      const res = fetch(moveUrl);
      const moveData = res.json();
      console.log("fetched move from api", moveData);
      const description = moveData?.flavor_text_entries.filter((val) => {
        return (val.group_version.name = "firered-leafgreen");
      })[0]?.flavor_text;
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingSkill(false);
    }
  }

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
      {skill && (
        <Modal
          handleCloseModal={() => {
            setSkill(null);
          }}
        >
          <div>
            <h6>Name</h6>
            <h2></h2>
          </div>
          <div>
            <h6>Description</h6>
            <p>dfsljdsjf</p>
          </div>
        </Modal>
      )}
      <div>
        <h4>#{getFullPokedexNumber(selectedPokemon)}</h4>
        <h2>{name}</h2>
      </div>
      <div className="type-container">
        {types.map((typeObj, typeIndex) => {
          return <TypeCard key={typeIndex} type={typeObj?.type?.name} />;
        })}
      </div>
      <img
        className="default-img"
        src={"/pokemon/" + getFullPokedexNumber(selectedPokemon) + ".png"}
        alt={`${name}--large-img`}
      />
      <div>
        {imgList.map((spriteUrl, spriteIndex) => {
          const imgUrl = sprites[spriteUrl];
          return (
            <img
              key={spriteIndex}
              src={imgUrl}
              alt={`${name}-img-${spriteUrl}`}
            />
          );
        })}
      </div>
      <h3>Stats</h3>
      <div className="stats-card">
        {stats.map((statObj, statIndex) => {
          const { stat, base_stat } = statObj;
          return (
            <div className="stat-item" key={statIndex}>
              <p>{stat?.name.replaceAll("-", " ")}</p>
              <h4>{base_stat}</h4>
            </div>
          );
        })}
      </div>
      <h3>Moves</h3>
      <div className="pokemon-move-grid">
        {moves.map((moveObj, moveIndex) => {
          return (
            <button
              className="button-card pokemon-move"
              key={moveIndex}
              onClick={() => {}}
            >
              {moveObj?.move?.name.replaceAll("-", " ")}
            </button>
          );
        })}
      </div>
    </div>
  );
}
