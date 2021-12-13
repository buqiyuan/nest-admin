import { format } from 'date-fns';

Date.prototype.toJSON = function () {
  return format(this, 'yyyy-MM-dd HH:mm:ss');
};
