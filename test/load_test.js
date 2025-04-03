import http from 'k6/http';
import { sleep } from 'k6';

export let options = {
  // Note: Adjust the VUs and stages as per your available resources.
  stages: [
    { duration: '30s', target: 2 }, // Ramp up to 20 users
    { duration: '1m', target: 2 }, // Hold at 1000 users
    { duration: '30s', target: 0 }, // Ramp down to 0 users
  ],
};

export default function () {
  http.get(
    'http://localhost:3010/book/get/all?filter=Young%20Adult&limit=50&page=1',
  );
  sleep(1);
}
