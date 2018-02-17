## Hyfer

This is a small setup for the project. `react-router-dom` is added and configured so please take a look in `app.js` to how it all work.

Also [css modules](https://github.com/gajus/react-css-modules) is enabled, it's an easier way of styling without caring about if class names collide. Please take a look at the link, it'll save us a lot of headache.

You will find a couple of folders

* `Pages`: these are the components that are being renderd directly in the `app.js`
* `Components`: these are the components that are embedded in components of the `Pages` folder
* `Helpers`: these are reusable components such as a button, inputFiled...

The structure is made so that it's easy to integrate you already built parts of the project. Look into the folder named `Pages` you will already find two folders called `Users` and `Modules`, you can put your made components instead of what's in there. But for the consistancy try to follow the folder structure mentioned before.

Run 'yarn' to install needed dependencies then you can run `yarn start` to start the app.
