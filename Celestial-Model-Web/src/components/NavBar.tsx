function NavBar() {
  return (
    <>
      <div className="h-screen w-1/3 flex items-center flex-col justify-center bg-sky-950 p-4">
        <h2 className="font-Inter text-3xl font-bold text-center text-white p-4">
          Celestial Model
        </h2>
        <p className="font-Inter text-white text-lg text-center p-4">
          The celestial model provides a unique visualization of an atom, where
          each element is represented as a celestial body in a dynamic 3D space.
          By clicking on an element, users can explore detailed information
          about its atomic structure, including electron configurations, atomic
          mass, and other properties. This interactive model helps in
          understanding the complex nature of atoms in an engaging and intuitive
          way.
        </p>
        <p className="font-Inter text-white text-xl font-bold text-center p-4">
          Click on an element to explore its atomic structure.
        </p>
      </div>
    </>
  );
}
export default NavBar;
