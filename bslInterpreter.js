'use strict';



class BslInterpreter {
    constructor(options) {
        options = options || {};
        if (!options.bot || !options.programJson) {
            throw new Error('Invalid arguments. bot and programJson are required');
        }
        this.bot = options.bot;
        this.programJson = options.programJson;
        this.props = [];
    }

    getProperty(prop) {
      this.bot.getProp(prop).then((val) => {
        if (typeof val === 'undefined') {
          val = '';
        }
        this.props[prop] = val;
        if (prop == 'scenario') {
          if (!val) {
            this.scenario = 'main_scenario';
            this.props['scenario'] = 'main_scenario';
            this.bot.setProp('scenario','main_scenario');
          }
        }
        if (prop == 'step') {
          if (!val) {
            this.step = '0';
            this.props['step'] = '0';
            this.bot.setProp('step','0');
          }
        }
        this._continue({scenario: this.scenario, step: this.step }, Math.random().toString(36).substring(5), 'getprop' + this.debug);
      });
    }

    _continue(options, debug, caller_debug) {
      this.debug = debug;
      this.caller_debug = caller_debug;

      if (typeof options === 'undefined') {
        options = [];
      }

      if (typeof options.scenario !== 'undefined') {
        this.scenario = options.scenario;
        this.props['scenario'] = options.scenario;
      }
      if (typeof options.step !== 'undefined') {
        this.step = options.step;
        this.props['step'] = options.step;
      }
      if (typeof options.asked !== 'undefined') {
        this.asked = options.asked;
        this.props['asked'] = options.asked;
      }

      if (typeof this.scenario === 'undefined') {
        if (typeof this.props['scenario'] === 'undefined') {
          return this.getProperty('scenario');
        }
        this.scenario = this.props['scenario'];
      }

      if (typeof this.step === 'undefined') {
        if (typeof this.props['step'] === 'undefined') {
          return this.getProperty('step');
        }
        this.step = this.props['step'];
      }

      if (this.scenario == 'none') {
          var scenario1 = this.getScenario(this.message);
          if (scenario1 == 'none') {
            var dnundString = this.getDnund();
            return this.say(dnundString);
          }
          this.setScenario(scenario1);
          this.setStep(0);
      }

      var statementJson = this.getStatement();
      if (typeof statementJson === 'undefined') {
          this.setScenario('none');
          this.setStep(0);
          return;
      }
      return this.execStetement(this.message, statementJson);
    }

    startInterpret(message) {
      this.message = message;
      if (message == 'reset12345') {
        this.bot.setProp('scenario','');
        this.bot.setProp('step', '');

        return;
      }
      return this._continue();
    }

    increaseStep() {
        this.step = parseInt(this.step) + 1;
        this.bot.setProp('step',this.step);
        return this.step;
    }

    setStep(step) {
        this.step = parseInt(step);
        this.bot.setProp('step',this.step);
    }

    setScenario(scenario) {
        this.scenario = scenario;
        this.bot.setProp('scenario',this.scenario);
    }

    variablesReplace(text) {
      var matches = text.match(/\$\{[a-z0-9_]+\}/gi);
      if (matches) {
        matches.forEach((val) => {
            var prop = val.substring(2, val.length-1);
            if (typeof this.props[prop] !== 'undefined') {
              var re = new RegExp('\\$\\{'+prop+'\\}', "gi");
              text = text.replace(re, this.props[prop]);
            }
        });
      }
      return text;
    }

    loadVariables(text) {
      var matches = text.match(/\$\{[a-z0-9_]+\}/gi);
      var success = true;
      if (matches) {
        try {
          matches.forEach((val) => {
            var prop = val.substring(2, val.length-1);
            if (typeof this.props[prop] === 'undefined') {
              this.getProperty(prop);
              success = false;
              throw BreakException;
            }
          });
        } catch(e) {
            if (e!==BreakException) throw e;
        }
      }
      return success;
    }

    execStetement(message, statement) {
      if (typeof statement === 'undefined') { return; }
      if (typeof statement.statement === 'undefined') { return; }

      switch (statement.statement) {
        case "SAY":
            var randMess = this._getRandomArrayValue(statement.body);
            if (typeof randMess.value !== 'undefined') {
              var text = randMess.value;
              var success = this.loadVariables(text)
              if (success !== true) {
                return;
              }
              text = this.variablesReplace(text);
              return this.say(text, true);
            }
            break;
        case "ASK":
            if (typeof this.props['asked'] === 'undefined') {
              return this.getProperty('asked');
            }
            this.asked = this.props['asked'];
            if (typeof this.asked === 'undefined') {
              this.asked = 'false';
            }
            if (this.asked === 'true') {
              if (!message) {
                return;
              }
              var collectedValue = message.trim();

              var collectedVariable = statement.body.save.body.value.value;
              this.props[collectedVariable] = collectedValue;

              this.asked = 'false';
              this.props['asked'] = 'false';
              this.bot.setProp(collectedVariable, collectedValue);
              this.bot.setProp('asked', 'false');

              return this._continue({scenario: this.scenario, step: this.increaseStep(), asked:'false' } , Math.random().toString(36).substring(5), 'ask2:' + this.debug);
            } else {
              var randMess = this._getRandomArrayValue(statement.body.ask);
              if (typeof randMess.value !== 'undefined') {

                  var text = randMess.value;
                  var success = this.loadVariables(text)
                  if (success !== true) {
                    return;
                  }
                  text = this.variablesReplace(text);

                  this.asked = 'true';
                  this.props['asked'] = 'true';
                  this.bot.setProp('asked', 'true');

                  return this.say(text);
              }
            }
            break;
        /*case "PLUGIN":
            console.log("Plugin");
            return true;
            break;*/
      }

      return false;
    }

    getScenario(message) {
        for (var i = 0, len = this.programJson.scenarios.length; i < len; i++) {
          var scenario = this.programJson.scenarios[i];
          for (var j = 0, len2 = scenario.invoke.length; j < len2; j++) {
            if (scenario.invoke[j].value == message.toLowerCase()) {
              return scenario.scenario.value;
            }
          }
        }
        return 'none';
    }

    _getRandomArrayValue(arr) {
      if (typeof arr !== 'undefined') {
        if (typeof arr.length !== 'undefined') {
          return arr[Math.floor(Math.random()*arr.length)];
        }
      }
      return null;
    }

    getStatement() {
        if (this.scenario === 'main_scenario') {
            if (typeof this.programJson.main.body[this.step] !== 'undefined') {
                return this.programJson.main.body[this.step];
            }
        }
        for (var i = 0, len = this.programJson.scenarios.length; i < len; i++) {
            if (this.programJson.scenarios[i].scenario.value == this.scenario) {
                if (typeof this.programJson.scenarios[i].body[this.step] !== 'undefined') {
                    return this.programJson.scenarios[i].body[this.step];
                }
            }
        }
    }

    getDnund() {
      var vals = [];
      for (var i = 0, len = this.programJson.declaration.length; i < len; i++) {
        var statement = this.programJson.declaration[i];
        if (statement.statement == 'DNUND') {
          vals.push(statement.body.value);
        }
      }
      if (!vals.length) {
        return '';
      }
      return this._getRandomArrayValue(vals);
    }

    say(text, cont) {
      this.bot.say(text).then(() => {
        if (cont === true) {
          this._continue({scenario: this.scenario, step: this.increaseStep() } , Math.random().toString(36).substring(5), 'say:' + this.debug);
        }
      });
    }
}

module.exports = BslInterpreter;
