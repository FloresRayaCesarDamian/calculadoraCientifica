import { useState, useRef, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { pi, sqrt, pow, cbrt, log10, log, evaluate, cos, sin, tan } from 'mathjs';
import './Calculator.css';

export const Calculator = () => {
  const [result, setResult] = useState('');
  const [angleUnit, setAngleUnit] = useState('deg');
  const [calculated, setCalculated] = useState(false); // Nuevo estado para saber si se calculó el resultado
  const inputRef = useRef(null);

  useEffect(() => inputRef.current.focus(), []);

  function handleClick(e) {
    e.preventDefault();
    
    // Limpieza del resultado si se ha calculado y el siguiente input no es un operador
    if (calculated && !isOperator(e.target.name)) {
      setResult('');
      setCalculated(false);
    }

    if (result === 'Error' || result === 'NaN') {
      setResult('');
    }

    setResult((prev) => prev + e.target.name);
  }

  function isOperator(input) {
    return ['+', '-', 'x', '/', '^', '√', '(', ')', '√', '³√', 'n√', '^2' , '^3' , '^', 'e^', '!', 'log(', 'ln(', 'sin(','cos(','tan('].includes(input);
  }

  function backspace() {
    if (result === 'Error' || result === 'NaN') {
      setResult('');
    } else {
      // Expresiones regulares para detectar funciones 
      const functionsRegex = /(sin|cos|tan|log|ln|sqrt|cbrt)\($/;

      if (functionsRegex.test(result)) {
        // Si encuentra una función con paréntesis, elimina toda la función 
        setResult((prev) => prev.replace(functionsRegex, ''));
      } else {
        // Si no es una función, elimina el último carácter
        setResult((prev) => prev.slice(0, -1));
      }
    }
  }

  function clear() {
    setResult('');
  }

  function calculate() {
    try {
      let sanitizedResult = result.replace(/π/g, pi);
  
      // Reemplazo para raíz cuadrada
      sanitizedResult = sanitizedResult.replace(/√(\d+|\([^)]+\))/g, (_, number) => `sqrt(${number})`);
  
      // Reemplazos para logaritmos
      sanitizedResult = sanitizedResult.replace(/log\(/g, 'log10(');
      sanitizedResult = sanitizedResult.replace(/ln\(/g, 'log(');
  
      // Convertir las unidades de ángulo para funciones trigonométricas
      if (angleUnit === 'deg') {
        sanitizedResult = sanitizedResult.replace(/sin\(([^)]+)\)/g, (_, angle) => `sin(${angle} * pi / 180)`);
        sanitizedResult = sanitizedResult.replace(/cos\(([^)]+)\)/g, (_, angle) => `cos(${angle} * pi / 180)`);
        sanitizedResult = sanitizedResult.replace(/tan\(([^)]+)\)/g, (_, angle) => `tan(${angle} * pi / 180)`);
      }
  
      let res = evaluate(sanitizedResult);
  
      // Redondear solo si estamos en grados
      if (angleUnit === 'deg') {
        res = parseFloat(res).toFixed(2);
      }
  
      setResult(res.toString());
      setCalculated(true); // Marcar como calculado
    } catch (error) {
      setResult('Error');
      setCalculated(false); // Si hay error, no se marca como calculado
    }
  }
  

  function toggleAngleUnit() {
    setAngleUnit((prev) => (prev === 'deg' ? 'rad' : 'deg'));
  }

  return (
    <div className="container col-xs-12 text-center">
      <div className="row calculadora justify-content-center">
        <div className="display">
          <input type="text" value={result} ref={inputRef} readOnly />
        </div>
        <div className="buttons">
          <Button name="(" onClick={handleClick} className="btn dark">(</Button>
          <Button name=")" onClick={handleClick} className="btn btn-dark">)</Button>
          <Button name="√" onClick={handleClick} className="btn btn-dark">√</Button>
          <Button id="result" onClick={calculate} className="btn btn-primary igual delete">=</Button>
          <Button name="^2" onClick={handleClick} className="btn btn-dark">^2</Button>
          <Button name="^3" onClick={handleClick} className="btn btn-dark">^3</Button>
          <Button name="^" onClick={handleClick} className="btn btn-dark">^</Button>
          <Button name="e^" onClick={handleClick} className="btn btn-dark">e^x</Button>
          <Button name="!" onClick={handleClick} className="btn btn-dark">!</Button>
          <Button name="log(" onClick={handleClick} className="btn btn-dark">log</Button>
          <Button name="ln(" onClick={handleClick} className="btn btn-dark">ln</Button>
          <Button name="sin(" onClick={handleClick} className="btn btn-dark">sin</Button>
          <Button name="cos(" onClick={handleClick} className="btn btn-dark">cos</Button>
          <Button name="tan(" onClick={handleClick} className="btn btn-dark">tan</Button>
          <Button name="7" onClick={handleClick} className="number btn btn-dark">7</Button>
          <Button name="8" onClick={handleClick} className="number btn btn-dark">8</Button>
          <Button name="9" onClick={handleClick} className="number btn btn-dark">9</Button>
          <Button id="backspace" onClick={backspace} className="btn btn-dark delete">C</Button>
          <Button id="clear" onClick={clear} variant="dark" className="btn btn-dark delete">AC</Button>
          <Button name="4" onClick={handleClick} className="number btn btn-dark">4</Button>
          <Button name="5" onClick={handleClick} className="number btn btn-dark">5</Button>
          <Button name="6" onClick={handleClick} className="number btn btn-dark">6</Button>
          <Button name="x" onClick={handleClick} className="operator btn btn-dark">x</Button>
          <Button name="/" onClick={handleClick} className="operator btn btn-dark">/</Button>
          <Button name="1" onClick={handleClick} className="number btn btn-dark">1</Button>
          <Button name="2" onClick={handleClick} className="number btn btn-dark">2</Button>
          <Button name="3" onClick={handleClick} className="number btn btn-dark">3</Button>
          <Button name="+" onClick={handleClick} className="operator btn btn-dark">+</Button>
          <Button name="-" onClick={handleClick} className="operator btn btn-dark">-</Button>
          <Button name="0" onClick={handleClick} className="number btn btn btn-dark">0</Button>
          <Button name="." onClick={handleClick} className="number btn btn btn-dark">.</Button> 
          <Button name="π" onClick={handleClick} className="number btn btn btn-dark">π</Button>
          <Button name="%" onClick={handleClick} className="operator btn btn-dark">%</Button>
          <Button onClick={toggleAngleUnit} className="operator btn btn-dark">{angleUnit === 'deg' ? 'RAD' : 'DEG'} </Button>
        </div>
      </div>
    </div>
  );
};
