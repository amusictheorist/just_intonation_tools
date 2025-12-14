import { Link } from "react-router-dom";

const AboutPage = () => {
  return (
    <div className="pt-[100px] px-6 md:px-12 py-12 bg-gray-50">
      <header className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-center md:text-left text-gray-800">
          About this Project
        </h1>

        <section className="bg-white rounded-xl shadow-md p-8 mb-8 hover:shadow-lg transition-shadow duration-300">
          <p className="text-lg text-gray-700 mb-4">
            The features on this website are built to apply the tools created in my dissertation 
            <em> "A Theory of Sets and Harmonic Complexity in Just Intonation and its Equal Temperament Approximations in the Chamber Music of Georg Friedrich Haas." </em><br />
            The <Link to='/calculator' className="text-blue-600 font-semibold hover:underline hover:scale-105 transition-transform">Set Calculator</Link> enables one to enter a set of integers, which are then interpreted as a set of partials, partial-classes, and the set classes to which they belong. These interpretations are both as pitches and as pitch-classes. The calculator then allows one to transpose their set by some specified integer.<br />
            The <Link to='/spiral' className="text-blue-600 font-semibold hover:underline hover:scale-105 transition-transform">Harmonic Spiral</Link> allows the user to visually appreciate the relationships between partials of a harmonic series in an expanding spiral. The spiral supports inputting one or several integers at once, drawing the spiral as necessary, as well as selecting individual partials. The selected partials are then interpreted as sets of partials, partial-classes, and the sets to which they belong. Also included are interval matrices for pitch and pitch-class intervals between the selected partials.<br />
            The <Link to='/lattice' className="text-blue-600 font-semibold hover:underline hover:scale-105 transition-transform">Ratio Lattice Visualizer</Link> invites the user to experiment with creating a ratio lattice and understand its harmonic relationships via a manipulable 3D model. New ratios are generated on the lattice as the user inputs them, allowing one to create and understand the lattice step-by-step. The abstract for the disertation can be found further below.
          </p>
        </section>

        <section className="bg-white rounded-xl shadow-md p-8 mb-8 hover:shadow-lg transition-shadow duration-300">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Set Theory and the Harmonic Series</h2>
          <p className="text-lg text-gray-700 mb-4">
            The set theory I developed takes as its foundation the series of harmonic partials over a fundamental tone (see image below). If you're not familiar with pitch-class set theory, I recommend looking over{" "}
            <a href="https://viva.pressbooks.pub/openmusictheory/chapter/pc-sets-normal-order-and-transformations/"
               target="_blank"
               rel="noopener noreferrer"
               className="text-blue-600 font-semibold hover:underline hover:scale-105 transition-transform"
            >this chapter</a> by Brian Moseley and Megan Lavengood to become familiar with its concepts.
          </p>
          

          <div className="mb-6">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/e/e6/Harmonic_Series.png"
              alt="Harmonic Series illustration showing partials of a harmonic series in music."
              className="w-full h-auto border border-gray-300 rounded-lg shadow-md hover:scale-105 transition-transform duration-300"
            />
            <p className="text-sm text-gray-500 mt-2">
              Image:{" "}
              <a href="https://commons.wikimedia.org/wiki/File:Harmonic_Series.png" className="text-blue-600 hover:underline">Harmonic Series</a>{" "}
              by <a href="https://commons.wikimedia.org/wiki/User:Hyacinth" className="text-blue-600 hover:underline">Hyacinth</a>.
            </p>
          </div>
          <p className="text-lg text-gray-700 mb-4">
            As one can see, the harmonic partials can be (and usually are) numbered as integers above the fundamental, which can also be labeled as 1. These integers represent not only the ascending series of partials, they also represent the ratio with which partials vibrate above the fundamental, for instance, the second partial vibrates 2 times as fast, the third partial 3 times as fast, and so on. This means the intervals in the harmonic series are rational intervals, which are the foundation for just intonation.
          </p>
          <p className="text-lg text-gray-700 mb-4">
            In my proposed theory, the harmonic series serves as the foundational space for set theory, with its partials forming the elements of the sets, something I refer to as <strong>partial space</strong>. These are the numbers that make the <Link to='/lattice' className="text-blue-600 font-semibold hover:underline hover:scale-105 transition-transform">Set Calculator</Link> work. We can also observe octave equivalence (the sense that two or more pitches sound the "same" but at different pitch heights), which in partial space refers to partials related by powers of 2. The <Link to='/spiral' className="text-blue-600 font-semibold hover:underline hover:scale-105 transition-transform">Harmonic Spiral</Link> depicts this nicely: partials related by powers of 2 along the same axis away from the fundamental, somewhat like "spokes" extending away from the center. <br />
            Octave equivalence creates partial classes, and just as partial sets exist, so too can partial-class sets be created. Both kinds of set can then be transposed, and transpositions of these sets can be collected into partial-set classes and partial-class set classes. The calculator computes all of these details when entering a set of numbers, and the spiral gives the same kind of information as partials are selected.
          </p>
        </section>
        <section className="bg-white rounded-xl shadow-md p-8 mb-8 hover:shadow-lg transition-shadow duration-300">
          <p className="text-lg text-gray-600 mb-8">
            The last component of my theory is a new approach to consider the complexity of rational intervals in what I refer to as <em>harmonic complexity</em>. This aspect of my work is deeply influenced by Robert Hasegawa's {' '}
            <a href="https://doi.org/10.1080/07494460600726529" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 font-semibold hover:underline">
              "Tone representation and just intervals in contemporary music"</a>.
            To measure the harmonic complexity of a set, I simply add up the numbers of the set class to which the set belongs, which can be measured both for partials and partial classes. </p>
          <p className="text-lg text-gray-600 mb-8">
            The full text for the dissertation can be found
            <a href="https://utoronto.scholaris.ca/items/59c5fe76-ee55-43a3-b1d0-ca1c4137dd7c" target="_blank" rel="noopener noreferrer" className="text-blue-600 font-semibold hover:underline"> here</a>.
            The abstract is found below.
          </p>
        </section>

        {/* Abstract section */}
        <section className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8 mb-8 shadow-inner">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Abstract</h2>
          <p className="text-lg text-gray-700 mb-4">
            Just Intonation (JI), with its foundation in the harmonic series, resists many of the analytical tools developed for music in equal-tempered (ET). Ratio-based approaches offer precision in describing JI's intervallic relationships but struggle to account for larger-scale harmonic organization, while set-theoretic models developed for ET rarely engage with JI's rational tuning systems. In this dissertation, I develop a set-theoretic framework for JI that remains attuned to its acoustic and perceptual realities while expanding the analytical vocabulary available for microtonal music. I examine two principal traditions in contemporary JI composition: extended JI, which applies systematic and transformational approaches to rational tuning, and spectral practices that explore the fluid interactions between JI and ET. These analytical tools are applied to a diverse repertoire, ranging from works that rigorously adhere to JI structures to those that blur the boundaries between tuning systems.
          </p>
          <p className="text-lg text-gray-700 mb-4">
            The dissertation is divided into two parts, each addressing distinct but interrelated aspects of JI and its applications. Part 1, “A Theory of Sets and Harmonic Complexity in Just Intonation,” introduces the theoretical framework and analytical tools underpinning the study. It comprises three chapters: Chapter 1 provides a general introduction, Chapter 2 defines the key concepts and tools, and Chapter 3 demonstrates their application in analyzing contemporary compositions employing JI.
          </p>
          <p className="text-lg text-gray-700 mb-4">
            Part 2, “Equal Temperament Approximations and Harmonic Complexity in the Chamber Music of Georg Friedrich Haas,” builds on the methods and tools from Part 1 to explore Haas's integration of JI and ET in his music. This part includes four chapters: Chapter 4 introduces Haas's chamber music up to 2015, highlighting his distinctive style and techniques. Chapter 5 focuses on what I call static harmony in Haas's works, while Chapter 6 examines his use of progressive harmony. Chapter 7 concludes Part 2 by discussing large-scale structure in select chamber works and offering a summary of the dissertation with directions for future research.
          </p>
        </section>
      </header>
    </div>
  );
};

export default AboutPage;
