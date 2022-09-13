const Validator = (option) => {
  const formElement = document.querySelector(option.form);
  const selectorRule = {};
  const Validate = (inputElement, rule) => {
    const errorElement = inputElement.parentElement.querySelector(
      option.errorSelector
    );
    var errorMessage;
    const rules = selectorRule[rule.selector];
    for (var i = 0; i < rules.length; ++i) {
      errorMessage = rules[i](inputElement.value);
      if (errorMessage) {
        break;
      }
    }
    // console.log(validate)
    if (errorMessage) {
      errorElement.innerHTML = errorMessage;
      inputElement.parentElement.classList.add("invalid");
    } else {
      errorElement.innerHTML = "";
      inputElement.parentElement.classList.remove("invalid");
    }
    return !errorMessage;
  };
  const removeValid = (inputElement) => {
    const errorElement = inputElement.parentElement.querySelector(
      option.errorSelector
    );
    errorElement.innerHTML = "";
    inputElement.parentElement.classList.remove("invalid");
  };
  if (formElement) {
    var formValid = true;
    formElement.onsubmit = (e) => {
      e.preventDefault();
      option.rules.forEach((rule) => {
        const inputElement = formElement.querySelector(rule.selector);
        var isValid = Validate(inputElement, rule);
        if (!isValid) {
          formValid = false;
        }
      });
      if (formValid) {
        if (typeof option.onSubmit === "function") {
          var inputSubmit = formElement.querySelectorAll("[name]");
          var valueSubmit = Array.from(inputSubmit).reduce((values, input) => {
            values[input.name] = input.value;
            console.log(values)
            return values;
          }, {});
          option.onSubmit(valueSubmit);
        }
      }
    };

    option.rules.forEach((rule) => {
      const inputElement = formElement.querySelector(rule.selector);
      if (Array.isArray(selectorRule[rule.selector])) {
        selectorRule[rule.selector].push(rule.test);
      } else {
        selectorRule[rule.selector] = [rule.test];
      }
      inputElement.onblur = () => {
        Validate(inputElement, rule);
      };
      inputElement.oninput = () => {
        removeValid(inputElement);
      };
    });
  }
};
Validator.isRequired = (selector, message) => {
  return {
    selector: selector,
    test: (value) => {
      return value ? undefined : message || "Bạn chưa nhập trường này !!!";
    },
  };
};
Validator.isEmail = (selector, message) => {
  const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return {
    selector: selector,
    test: (value) => {
      return regex.test(value)
        ? undefined
        : message || "Email nhập không đúng!!!";
    },
  };
};
Validator.minLength = (selector, min, message) => {
  return {
    selector: selector,
    test: (value) => {
      return value.length >= min
        ? undefined
        : message || `Vui lòng nhập tối thiểu ${min} ký tự !!!`;
    },
  };
};
Validator.inConfirmed = (selector, password, message) => {
  return {
    selector: selector,
    test: (value) => {
      return value === password()
        ? undefined
        : message || "Bạn chưa nhập trường này !!!";
    },
  };
};
