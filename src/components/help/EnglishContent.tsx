const EnglishContent = () => {
  return (
    <>
      <h2>Harmonic Colors</h2>
      <p>Harmonic Colors is a visualization web application that uses color and visual effects to represent musical chord progressions.</p>
      <p>The 12 notes are mapped onto a color wheel, and the notes of each chord are determined based on music theory using the key color. </p>
      <p>Four-note chords are represented by color changes, and tension notes are represented by adding particles. </p>

      <h2>How to Use</h2>

      <h3>Create a Chord Progression</h3>
      <ol>
        <li>Key: Select a major or minor key. </li>
        <li>Add Chord: Click a chord to add it. </li>
        <li>Section: Change the key for each section. </li>
        <li>Playback: Play each section individually. </li>
      </ol>

      <h3>View Chord Progressions</h3>
      <ol>
        <li>Playback Mode: Displays chord progressions based on the playback position</li>
        <li>Preview Mode: Drag or use the scroll bar to view the entire progression</li>
      </ol>

      <h3>Settings</h3>
      <ul>
        <li>You can rotate the major/minor color wheel to adjust the color to your liking. </li>
        <li>You can choose between Marble and Stripes for the visualization. </li>
        <li>You can choose from three minor scales to define diatonic chords. </li>
      </ul>

    </>
  );
};

export default EnglishContent;
