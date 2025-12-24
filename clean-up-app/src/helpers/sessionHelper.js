import { auth, db } from '@/firebase';
import { doc, getDoc, getDocFromCache, getDocFromServer } from 'firebase/firestore';

async function cacheManager(docRef) {
	let snap;
	try {
		snap = await getDocFromCache(docRef);
	} catch (err) {
		snap = await getDocFromServer(docRef);
	}
	return snap;
}

export default async function getUserType() {
	let type = null;
	if (auth.currentUser) {
		const userDocRef = doc(db, 'users', auth.currentUser.uid);
		const snap = await cacheManager(userDocRef);
		type = snap.data().type;
	}
	return type;
}
