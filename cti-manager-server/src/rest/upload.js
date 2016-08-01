import multer from 'multer';

import appConfig from '../config/app.config';

export default multer({dest: `${appConfig.tmpDir}`});
