import { memo, useCallback, useEffect, useRef, useState } from "react"
import "./DropdownInput.css"

const DropdownInput = memo(({ 
  values,
  name,
  label,
  id,
  className="",
  inputClass="",
  placeholder,
  onChange=null,
  onValid=null,
  onInvalid=null,
  initialValue="",
  submitOnEmpty=false,
  submitOnClick=false,
  style={},
 }) => {

  const [ list, setList ] = useState([]);
  const [ inputVal, setInputVal ] = useState("");
  const [ currentHover, setCurrentHover ] = useState(0);
  const [ isFocused, setIsFocused ] = useState(false);
  const listRef = useRef();
  const submitForm = useRef();

  useEffect(() => {
    if (values && ( list && !list.length)) setList(values);
  }, [values])

  useEffect(() => {
    if (initialValue && inputVal !== initialValue) {
      setInputVal(initialValue);
      onValid && onValid(initialValue);
    }
  }, [initialValue])

  const filter = useCallback(() => {
      return values.filter(x => x.includes(inputVal));
  }, [inputVal])

  useEffect(() => {
    if (!values) return;
    const filters = filter();
    setList(filters);
  }, [inputVal])

  const getElem = index => document.getElementById(`${id}-${index}`);

  const click = () => {
      const elem = document.getElementById(`${id}-${currentHover}`)
      elem.click();
      const newVal = list[currentHover];
      setInputVal(newVal);
      onValid && onValid(newVal);
      elem.blur();
  }
  
  const shouldScrollDown = elem => {
    return elem.offsetTop + elem.clientHeight > listRef.current.scrollTop + listRef.current.clientHeight;
  }

  const shouldScrollUp = elem => {
    return elem.offsetTop < listRef.current.scrollTop;
  }

  const isValid = useCallback(() => list.some(x => x === inputVal), [inputVal, list]);

  useEffect(() => {
    if (onValid && isValid()) {
        onValid(inputVal);
    }
    if (onInvalid && !isValid()) {
      onInvalid();
    }
  }, [inputVal])

  const onKeyDown = e => {
    if (e.key === "ArrowDown" && list.length) {
      setCurrentHover(prev => {
        if (prev === list.length - 1) {
          getElem(0).scrollIntoView();
          return 0;
        } else {
          const elem = getElem(prev + 1)
          if (shouldScrollDown(elem)) {
            elem.scrollIntoView(true);
          }
          return prev + 1;
        }
      })
    } else if (e.key === "ArrowUp" && list.length) {
      setCurrentHover(prev => {
        if (prev <= 0) {
          const lastIndex = list.length - 1 ;
          const elem = getElem(lastIndex);
          elem.scrollIntoView();
          return lastIndex;
        } else {
          const elem = getElem(prev - 1)
          if (shouldScrollUp(elem)) {
            elem.scrollIntoView(true);
          }
          return prev - 1;
        }
      })
    } else if (e.key === "Enter") {
      e.stopPropagation();
      e.preventDefault();
      if (list.length > 0) {
        click();
        e.target.blur();
      }
    }
  }

  const _onChange = e => {
    const val = e.target.value ;
    if (val === "" && submitOnEmpty) {
      submitForm.current.click();
    }
    setInputVal(val);
    onChange && onChange(val);
  }

  return values && (
    <div 
      className={["datalist", className].join(" ")}
      style={style}
    >
      {label && <label htmlFor={name}>{label}</label>}
        <input 
          className={inputClass}
          type="text" 
          name={name}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          id={name}
          value={inputVal}
          onChange={e => _onChange(e)}
          onKeyDown={e => onKeyDown(e)}
          placeholder={placeholder}
          autoComplete="off"
          autoCorrect="off"
          spellCheck="off"
        />
      <div 
        className="list"
        tabIndex={0} 
        ref={listRef}
      >
        {list?.map((x, i) => (
            <button 
              type={ submitOnClick && currentHover === i && isFocused ? "submit" : "button"}
              tabIndex={0}
              className={`item${i === currentHover ? " active" : ""}`}
              name={name}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              key={x}
              onMouseEnter={() => setCurrentHover(i)}
              // disabled={inputVal === x}
              onClick={click}
              value={x}
              id={`${id}-${i}`}
            >
              <span>{x}</span>
            </button>
          )
        )}
        {
          list?.length === 0 && values.length > 0 && 
          <div className="item no-results">
            <span style={{ color: "var(--soft-grey)" }}>no results</span>
          </div>
        }
      </div>
      { submitOnEmpty && 
      <button type="submit" ref={submitForm} style={{ display: "none" }}/>
      }
  </div>
  )
})

export default DropdownInput
