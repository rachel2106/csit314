// firebaseAuth.test.js
// import Firebase from './firebaseAuth.js';
import { db, Firebase } from './firebaseAuth.js';
import * as firestore from 'firebase/firestore';
// import * as firebaseModule from './firebaseAuth.js';

jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(),
  collection: jest.fn(),
  doc: jest.fn(),
  setDoc: jest.fn(),
  getDocs: jest.fn(),
  updateDoc: jest.fn(), 
  deleteDoc: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  serverTimestamp: jest.fn(),
}));


describe('Firebase.createServiceCategory', () => {
  let firebase;

  beforeEach(() => {
    // Clear mocks before each test
    jest.clearAllMocks();
    firebase = new Firebase();
  });

  const { getDocs } = firestore;

test('should create service category successfully', async () => {
  firestore.getDocs.mockResolvedValue({ empty: true });

  const testData = {
    serviceCategory: 'Carpet Cleaning',
    description: 'Professional carpet cleaning',
    currentUserEmail: 'testUserId',
  };

  const dummyDocRef = {};
  firestore.doc.mockReturnValue(dummyDocRef);
  firestore.setDoc.mockResolvedValue();

  const result = await firebase.createServiceCategory(testData);

  expect(result.status).toBe("success");  // make sure your function returns this
});



  // test('should return error if category name is missing', async () => {
  //   const testData = {
  //     serviceCategory: '',
  //     description: 'desc',
  //     currentUserEmail: 'test@example.com',
  //   };

  //   const result = await firebase.createServiceCategory(testData);

  //   expect(result.status).toBe("error");
  //   expect(result.message).toMatch(/Invalid or missing category name/i);
  // });

  test('should return error if category exists', async () => {
    const testData = {
      serviceCategory: 'Cleaning',
      description: 'desc',
      currentUserEmail: 'test@example.com',
    };

    // Simulate existing category found
    getDocs.mockResolvedValue({ empty: false });

    const result = await firebase.createServiceCategory(testData);

    expect(result.status).toBe("error");
    expect(result.message).toMatch(/already exists/i);
  });

  // test('should return error if description is missing', async () => {
  //   const testData = {
  //       serviceCategory: 'Window Cleaning',
  //       description: '',
  //       currentUserEmail: 'test@example.com',
  //   };

  //   const result = await firebase.createServiceCategory(testData);

  //   expect(result.status).toBe('error');
  //   expect(result.message).toMatch(/Invalid or missing description name/i);
  //   });

});

describe('Firebase.viewServiceCategory', () => {
  let firebase;

  beforeEach(() => {
    // Clear mocks before each test
    jest.clearAllMocks();
    firebase = new Firebase();
  });

  const { getDocs } = firestore;

    test('should return category list successfully', async () => {
  const mockDocs = [
    {
      id: '1',
      data: () => ({
        serviceCategory: 'Test Service',
        description: 'A service',
        createdAt: { toDate: () => new Date('2024-01-01') },
        createdBy: 'user1',
      }),
    },
    {
      id: '2',
      data: () => ({
        serviceCategory: 'Another Service',
        description: 'Another desc',
        createdAt: { toDate: () => new Date('2024-02-01') },
        createdBy: 'user2',
      }),
    },
  ];

  firestore.getDocs.mockResolvedValue({
    forEach: (callback) => mockDocs.forEach(callback),
  });

  const result = await firebase.getCategoryList();

  expect(Array.isArray(result)).toBe(true);
  expect(result.length).toBe(2);
  expect(result[0].serviceCategory).toBe('Test Service');
  expect(result[1].description).toBe('Another desc');
});

test('should return empty array if no categories found', async () => {
  firestore.getDocs.mockResolvedValue({
    forEach: () => {}, // Nothing to iterate over
  });

  const result = await firebase.getCategoryList();
  expect(result).toEqual([]);
});

});


describe('Firebase.updateServiceCategory', () => {
  let firebase;

  beforeEach(() => {
    jest.clearAllMocks();
    firebase = new Firebase();
  });

  test('should update service category successfully', async () => {
    const dummyDocRef = {};  // Firestore doc reference
    const testData = {
      categoryId: 'abc123',
      serviceCategory: 'Updated Cleaning',
      description: 'Updated description',
    };

    // Mock Firestore methods
    firestore.doc.mockReturnValue(dummyDocRef);
    firestore.updateDoc.mockResolvedValue();  // No error = success

    const result = await firebase.updateServiceCategory(testData);

    expect(firestore.doc).toHaveBeenCalledWith(firebase.db, "csit314/AllServiceCategory/CleaningServiceData", 'abc123');
    expect(firestore.updateDoc).toHaveBeenCalledWith(dummyDocRef, {
      serviceCategory: 'Updated Cleaning',
      description: 'Updated description',
    });

    expect(result).toEqual({
      success: true,
      message: "Service category updated"
    });
  });

  test('should return error if required fields are missing', async () => {
    const testData = {
      categoryId: '',
      serviceCategory: '',
      description: '',
    };

    const result = await firebase.updateServiceCategory(testData);

    expect(result).toEqual({
      success: false,
      message: "Missing required fields!"
    });
  });

  test('should handle Firestore update errors', async () => {
    const dummyDocRef = {};
    const testData = {
      categoryId: 'abc123',
      serviceCategory: 'Updated Service',
      description: 'New desc',
    };

    firestore.doc.mockReturnValue(dummyDocRef);
    firestore.updateDoc.mockRejectedValue(new Error('Firestore update failed'));

    const result = await firebase.updateServiceCategory(testData);

    expect(result.success).toBe(false);
    expect(result.message).toMatch(/Firestore update failed/);
  });
});


describe('Firebase.deleteServiceCategory', () => {
  let firebase;

  beforeEach(() => {
    jest.clearAllMocks();
    firebase = new Firebase();
  });

  test('should delete service category successfully', async () => {
  const fakeDocRef = { ref: 'fakeRef1' };
  const fakeQuerySnapshot = {
    empty: false,
    docs: [fakeDocRef]
  };

  firestore.collection.mockReturnValue('mockedCollection');
  firestore.where.mockReturnValue('mockedWhere');
  firestore.query.mockReturnValue('mockedQuery');
  firestore.getDocs.mockResolvedValue(fakeQuerySnapshot);
  firestore.deleteDoc.mockResolvedValue(); // resolves successfully

  const firebase = new Firebase(); // your Firebase class instance
  const result = await firebase.deleteServiceCategory("Cleaning");

  expect(firestore.collection).toHaveBeenCalled();
  expect(firestore.query).toHaveBeenCalled();
  expect(firestore.getDocs).toHaveBeenCalled();
  expect(firestore.deleteDoc).toHaveBeenCalledWith(fakeDocRef.ref);
  expect(result.success).toBe(true);
});
test('should throw error if no matching category found', async () => {
  const fakeQuerySnapshot = {
    empty: true,
    docs: []
  };

  firestore.collection.mockReturnValue('mockedCollection');
  firestore.where.mockReturnValue('mockedWhere');
  firestore.query.mockReturnValue('mockedQuery');
  firestore.getDocs.mockResolvedValue(fakeQuerySnapshot);

  const firebase = new Firebase();

  await expect(firebase.deleteServiceCategory("NonexistentCategory"))
    .rejects
    .toThrow("No user found with this email.");
});

test('should throw error if Firestore delete fails', async () => {
  const fakeDocRef = { ref: 'fakeRef1' };
  const fakeQuerySnapshot = {
    empty: false,
    docs: [fakeDocRef]
  };

  firestore.collection.mockReturnValue('mockedCollection');
  firestore.where.mockReturnValue('mockedWhere');
  firestore.query.mockReturnValue('mockedQuery');
  firestore.getDocs.mockResolvedValue(fakeQuerySnapshot);
  firestore.deleteDoc.mockRejectedValue(new Error("Firestore delete failed"));

  const firebase = new Firebase();

  await expect(firebase.deleteServiceCategory("Cleaning"))
    .rejects
    .toThrow("Firestore delete failed");
});


});


describe('Firebase.searchServiceCategory', () => {
  let firebase;

  beforeEach(() => {
    jest.clearAllMocks();
    firebase = new Firebase();
  });

  test('should return matching categories based on search', async () => {
  const mockDocs = [
    {
      id: 'abc123',
      data: () => ({
        serviceCategory: 'Carpet Cleaning',
        description: 'Cleaning carpets',
        createdAt: { toDate: () => new Date('2025-05-18') },
      }),
    },
    {
      id: 'def456',
      data: () => ({
        serviceCategory: 'Window Cleaning',
        description: 'Cleaning windows',
        createdAt: { toDate: () => new Date('2025-04-01') },
      }),
    }
  ];

  firestore.collection.mockReturnValue('mockedCollection');
  firestore.where.mockReturnValue('mockedWhere');
  firestore.query.mockReturnValue('mockedQuery');
  firestore.getDocs.mockResolvedValue({
    docs: mockDocs,
  });

  const firebase = new Firebase();
  const results = await firebase.searchServiceCategory('Carpet Cleaning');

  expect(firestore.collection).toHaveBeenCalledWith(firebase.db, "csit314/AllServiceCategory/CleaningServiceData");
  expect(firestore.where).toHaveBeenCalledWith("normalizedCategory", "==", "carpetcleaning");
  expect(firestore.query).toHaveBeenCalledWith('mockedCollection', 'mockedWhere');
  expect(firestore.getDocs).toHaveBeenCalledWith('mockedQuery');

  expect(results.length).toBe(2);
  expect(results[0]).toMatchObject({
    id: 'abc123',
    serviceCategory: 'Carpet Cleaning',
    description: 'Cleaning carpets',
    createdAt: expect.any(Date),
  });
});

test('should return empty array when no matching categories found', async () => {
  firestore.collection.mockReturnValue('mockedCollection');
  firestore.where.mockReturnValue('mockedWhere');
  firestore.query.mockReturnValue('mockedQuery');
  firestore.getDocs.mockResolvedValue({
    docs: []
  });

  const firebase = new Firebase();
  const results = await firebase.searchServiceCategory('Nonexistent Category');

  expect(results).toEqual([]);
});



  


});

