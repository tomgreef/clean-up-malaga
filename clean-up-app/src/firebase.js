import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
	apiKey: 'AIzaSyCEZ-xMjsoJlJyyeMdL3rNiHA-454Nxres',
	authDomain: 'clean-up-e3ad6.firebaseapp.com',
	databaseURL: 'https://clean-up-e3ad6.firebaseio.com',
	projectId: 'clean-up-e3ad6',
	storageBucket: 'clean-up-e3ad6.appspot.com',
	messagingSenderId: '223341924469',
	appId: '1:223341924469:web:069b6c81d1c7cc2601283c',
	measurementId: 'G-EPFMYW0M7H'
};

export const firebaseApp = initializeApp(firebaseConfig);

export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);
export const storage = getStorage(firebaseApp);

if (import.meta.env.MODE !== 'test') {
	enableIndexedDbPersistence(db).catch(err => {
		console.log('Error when enabling persistence:', err);
	});
}

export default {
	firebaseApp,
	auth,
	db,
	storage
};
