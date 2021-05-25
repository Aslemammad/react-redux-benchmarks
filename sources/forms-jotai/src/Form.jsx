import React from "react";
import { useAtom } from "jotai";
import * as c from "./constants";

const Form = ({ id, atom }) => {
  const [text, setText] = useAtom(atom);

  const fillers = Array.from({
    length: c.NUMBER_OF_CHECKBOXES_PER_FORM,
  }).map((_, i) => <input type="checkbox" key={i} />);

  return (
    <React.Fragment>
      <form style={{ display: "flex", alignItems: "flex-start" }}>
        Form {id}:
        <textarea
          id={`input-${id}`}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </form>
      <div>{fillers}</div>
    </React.Fragment>
  );
};

export default Form;
