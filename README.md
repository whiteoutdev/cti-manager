# CTI Manager

## Dev Setup

Dependencies are managed through npm, and the project use gulp as a build tool.

### External dependencies

#### MongoDB

[MongoDB](https://www.mongodb.com/) is used for data storage, and needs to be installed on the server machine. A mongod instance should be available on port 27017. No additional setup of MongoDB should be required.
 
#### FFMPEG
 
The server-side app does a small amount of video processing, for which it uses a node adaptor for FFMPEG. As such, [FFMPEG](https://ffmpeg.org/) should be installed and its bin directory (containing the ffmpeg and ffprobe executables) should be available on the path environment variable.

### Running the app

To run the application in development mode, ensure that the external dependencies above are installed. Then install dependencies with:

```
yarn
```

Run the app:

```
yarn run dev
```
