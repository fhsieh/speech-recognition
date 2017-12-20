Speech Recognition Test
============

Client-side word-matching app using [SpeechRecognition API](https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition) and built with VueJS.

![Speech Recognition Test](https://user-images.githubusercontent.com/9514732/34204475-13881324-e5c2-11e7-8916-2074adb4e872.gif)

A simple app that matches words heard by browser speech-to-text SpeechRecognition API against an input sentence.

VueJS provides an intuitive interface for adding/removing sentences, starting/stopping the microphone, and various options.

When the SpeechRecognition API returns a transcript of recognized words, a v-model `speech` object in Vue data is updated. Vue watchers and methods take care of event handling, and matching the transcript against the target `sentence`, which contains an array of objects `words`, each with an individual word in the sentence and a boolean `heard` indicating whether or not the word has been matched inside the SpeechRecognition transcript.

The Vue component `Target` takes care of adding the Bootstrap class `text-success` to each individual word according to its `heard` prop, which provides the highlight-as-heard visual feedback. A `History` component shows the SpeechRecognition transcript history of the user's spoken words, following a similar highlighting method. A computed property `correct` keeps track of the total number of matched words.

Customizing the sentences and behavior of the app is done by toggling the gear icon on the index view. Sentences and options are stored in localStorage.

### Options

- **Online recognition**: Use the browser built-in SpeechRecognition API, currently only available in Chrome and requires internet connection.
  - `on`: the browser will request microphone access, and will send transcript data to `speech` as soon as text is recognized.
  - `off`: no microphone is used. Instead, the app enables keyboard input into a standard text input form, which allows 3rd party speech-to-text services, such as Speech Recognition on Windows or Dictation on Mac, to input directly into the app.
- **Auto-start mic**: Automatically starts the mic when a sentence is selected from the index view. When in offline mode, this automatically enables the text input for 3rd party speech recognition input.
- **Strict word order**: Determines whether words in the user's spoken history should match the target in succeeding order.
  - `on`: given target "_One two three_", speaking "_One two something three_" will match the target, however speaking "_Three two one_" will only match _one_, as the target _One_ must be matched first before target _two_ can be matched.
  - `off`: given target "_One two three_", speaking "_One two something three_" or "_Three two one_" will match the target.
- **Show text input**: Shows/hides the text input box.
- **Read-only**: Enables/disables the text input box. When in `Offline recognition` mode, this option is disabled. The text input is force-enabled so that 3rd party speech recognition input services can pass text data into the app.

---

### Limitations

The SpeechRecognition API requires:
- Chrome browser
- Active internet connection
- The app must be served from an HTTP server (localhost server is sufficient)

The app can also be rolled into an ElectronJS package with minimal adjustments using [electron-vue](https://github.com/SimulatedGREG/electron-vue) and deployed as a client-side executable. However, Google has disabled the SpeechRecognition API in Chromium, which renders `Online recognition` mode useless. However, 3rd-party speech recognition methods are still funcitonal, so an ElectronJS package will still work with OS speech recognition.

---

### Running

1. Clone this repo
2. `npm install`
3. `npm run dev`
4. Point your browser to `http://localhost:8080/`
