DNUND     "Sorry, this is not defined in my script. type 'HELP' or 'h' for help.%[Help me!](postback:help)"

START     PERSONAL_BOT_OF_PAULIUS
SAY       "HI, my name is P. I was created using BSL (Bot Scenario Language) created by Paulius Rimavičius, a passionate entrepreneur and bot developer."
ASK       "What is your name?"
SAVE      name
ASK       "Where are you from?"
SAVE      from
SAY       "Great! ${name} from ${from}. What you want to do?"
SAY       "Do you want to learn more about Paulius? %[Learn more](postback:learn_more_about_paulius)"
SAY       "Or you are here for the bot? %[For a bot](postback:i_am_here_for_the_bot)"
END

SCENARIO  HELP "help" "?" "h" "menu" "help me"
SAY       "So, how can I help you ${name}?"
SAY       "I can tell you about BSL creator Paulius Rimavičius %[Learn more about Paulius](postback:learn_more_about_paulius)"
SAY       "Or I can tell you about the bot? %[about the bot](postback:i_am_here_for_the_bot)"
SAY       "To change your name, type name. %[change name](postback:name)"
END

SCENARIO  CREATOR "creator" "paulius" "learn_more_about_paulius"
SAY       "BSL creator Paulius Rimavičius is an entrepreneur and a developer."
SAY       "He is very passionate about chat bots!"
SAY       "%[more](postback:learn_more_about_paulius2)"
END

SCENARIO  CREATOR2 "learn_more_about_paulius2"
SAY       "Paulius is a co-founder at NoriuNoriuNoriu.lt, hotel and spa deals company"
SAY       "He likes to play Volleyball and snowboarding."
SAY       "%[more](postback:learn_more_about_paulius3)"
END

SCENARIO  CREATOR3 "learn_more_about_paulius3"
SAY       "${name}, Paulius is working hard to make BSL even better!"
SAY       "%[more](postback:learn_more_about_paulius4)"
END

SCENARIO  CREATOR4 "learn_more_about_paulius4"
SAY       "Contact Paulius if you want to talk about bots."
SAY       "%[LinkedIn Profile](https://www.linkedin.com/in/rimavicius)"
SAY       "%[Learn about bot](postback:i_am_here_for_the_bot)"
END

SCENARIO  BOT1 "bot" "i_am_here_for_the_bot"
SAY       "Hi my name is P. I was implemented in a special Bot Scenario Language, or BSL in short"
SAY       "I can easily talk to people, ask questions and remember answers."
SAY       "I can send pictures and links."
SAY       "I can send special control buttons called Postbacks."
SAY       "I can react on button clicks, and follow the scenario!"
SAY       "%[more](postback:i_am_here_for_the_bot2)"
END

SCENARIO  BOT2 "i_am_here_for_the_bot2"
SAY       "See BSL script on Github"
SAY       "%[BSL on GitHub](https://github.com/rimpa/BslBot/blob/master/script.bsl)"
SAY       "Instructions how to create your own bot on BSL"
SAY       "%[GitHub](https://github.com/rimpa/BslBot/)"
SAY       "%[more](postback:i_am_here_for_the_bot3)"
END

SCENARIO  BOT3 "i_am_here_for_the_bot3"
SAY       "My picture: ![bot](https://raw.githubusercontent.com/rimpa/BslBot/master/bot_500.png)"
SAY       "Enough about me, now it's time to learn more about Paulius!"
SAY       "%[more about Paulius](postback:learn_more_about_paulius)"
END

SCENARIO ME "me" "profile"
SAY       "Hi ${name}!"
SAY       "You are from ${from}"
END

SCENARIO  NAME "name"
ASK       "What\'s your name?"
SAVE      name
SAY       "Great! I'll call you ${name}"
ASK       "${name}, where there are you from?"
SAVE      from
SAY       "Nice! ${name} from ${from}"
END
