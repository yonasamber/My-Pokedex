export function Header(props) {
  const { handleToggleMenu } = props;
  return (
    <header>
      <button className="open-nav-button" onClick={handleToggleMenu}>
        <i className="fa-solid fa-list"></i>
      </button>
      <h1 className="text-gradient">Pokedéx</h1>
    </header>
  );
}
