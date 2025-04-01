// 1. Import necessary modules and types
import { useState } from "react"; // Import React and the useState hook
import type { Flashcard } from "../types"; // Import the Flashcard type definition
import { fetchHint } from "../services/api"; // Import the API service function for fetching hints

// 2. Define the Props interface
// This specifies what information this component expects to receive from its parent.
interface Props {
  card: Flashcard; // The flashcard data object to display
  showBack: boolean; // A flag indicating whether to show the back side or '???'
}

function FlashcardDisplay({ card, showBack }: Props) {
  // Destructuring props ({ card, showBack }) is a common way to access them directly.

  // 4. Use useState for hint-related state variables
  // - hint: Stores the fetched hint text (or null if no hint/not fetched)
  // - loadingHint: Tracks whether a hint fetch is currently in progress
  // - hintError: Stores any error message if fetching the hint fails
  const [hint, setHint] = useState<string | null>(null);
  const [loadingHint, setLoadingHint] = useState<boolean>(false);
  const [hintError, setHintError] = useState<string | null>(null);

  const handleGetHint = async () => {
    console.log(`Requesting hint for card: ${card.front}`);
    setLoadingHint(true); // Set loading state to true
    setHint(null); // Clear any previous hint
    setHintError(null); // Clear any previous error
    try {
      // Call the API service function, passing the current card
      const fetchedHint = await fetchHint(card);
      setHint(fetchedHint); // Update the hint state with the fetched value
    } catch (error) {
      console.error("Failed to fetch hint:", error);
      setHintError("Could not load hint."); // Set error message if the fetch fails
    } finally {
      // This block runs whether the try succeeded or failed
      setLoadingHint(false); // Set loading state back to false
    }
  };
  // 6. Render the JSX (HTML-like structure)
  return (
    // Basic styling using inline styles (you could use CSS classes instead)
    <div
      style={{
        border: "1px solid #ccc",
        padding: "15px",
        margin: "10px 0", // Add some vertical margin
        borderRadius: "5px",
        backgroundColor: "#f9f9f9", // Light background
      }}
    >
      {/* Always render the front of the card */}
      <h2 style={{ marginTop: 0 }}>{card.front}</h2>

      <hr style={{ margin: "10px 0" }} />

      {/* Conditionally render the back or '???' based on the showBack prop */}
      <p
        style={{
          fontSize: "1.1em",
          minHeight: "1.5em", // Ensure space even when '???'
          fontStyle: showBack ? "normal" : "italic",
          color: showBack ? "black" : "#777",
        }}
      >
        {showBack ? card.back : "???"}
      </p>

      {/* Conditionally render the "Get Hint" button */}
      {/* Only show the button if the back is NOT currently shown */}
      {!showBack && (
        <button
          onClick={handleGetHint} // Call the handler function on click
          disabled={loadingHint} // Disable the button while loading
          style={{ marginTop: "10px" }}
        >
          {loadingHint ? "Loading Hint..." : "Get Hint"}
        </button>
      )}

      {/* Display the fetched hint if available */}
      {hint && (
        <p style={{ marginTop: "10px", color: "#007bff" }}>
          <em>Hint: {hint}</em>
        </p>
      )}

      {/* Display an error message if hint fetching failed */}
      {hintError && (
        <p style={{ marginTop: "10px", color: "red" }}>{hintError}</p>
      )}
    </div>
  );
}

// Export the component to make it available for use in other files
export default FlashcardDisplay;
