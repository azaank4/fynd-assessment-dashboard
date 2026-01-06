from pymongo import MongoClient
from pymongo.errors import ServerSelectionTimeoutError
from app.config import MONGODB_URI, DATABASE_NAME, SUBMISSIONS_COLLECTION
from typing import Optional, List, Dict
from datetime import datetime
from bson.objectid import ObjectId
import logging

logger = logging.getLogger(__name__)

class Database:
    _client: Optional[MongoClient] = None
    _db = None

    @classmethod
    def connect(cls):
        """Connect to MongoDB"""
        try:
            cls._client = MongoClient(MONGODB_URI, serverSelectionTimeoutMS=5000)
            cls._db = cls._client[DATABASE_NAME]
            # Test connection
            cls._db.command('ping')
            logger.info("Connected to MongoDB")
        except ServerSelectionTimeoutError as e:
            logger.error(f"Failed to connect to MongoDB: {e}")
            raise

    @classmethod
    def disconnect(cls):
        """Disconnect from MongoDB"""
        if cls._client:
            cls._client.close()
            logger.info("Disconnected from MongoDB")

    @classmethod
    def get_db(cls):
        """Get database instance"""
        if cls._db is None:
            cls.connect()
        return cls._db

    @classmethod
    def insert_submission(cls, data: Dict) -> str:
        """Insert a new submission"""
        db = cls.get_db()
        collection = db[SUBMISSIONS_COLLECTION]
        result = collection.insert_one(data)
        return str(result.inserted_id)

    @classmethod
    def get_submission(cls, submission_id: str) -> Optional[Dict]:
        """Get a submission by ID"""
        db = cls.get_db()
        collection = db[SUBMISSIONS_COLLECTION]
        return collection.find_one({"_id": ObjectId(submission_id)})

    @classmethod
    def get_all_submissions(cls, limit: int = 100, skip: int = 0, rating_filter: Optional[int] = None) -> tuple[List[Dict], int]:
        """Get all submissions with optional filtering"""
        db = cls.get_db()
        collection = db[SUBMISSIONS_COLLECTION]
        
        query = {}
        if rating_filter:
            query["rating"] = rating_filter
        
        total = collection.count_documents(query)
        submissions = list(collection.find(query).sort("timestamp", -1).skip(skip).limit(limit))
        
        return submissions, total

    @classmethod
    def update_submission(cls, submission_id: str, data: Dict) -> bool:
        """Update a submission"""
        db = cls.get_db()
        collection = db[SUBMISSIONS_COLLECTION]
        result = collection.update_one({"_id": ObjectId(submission_id)}, {"$set": data})
        return result.modified_count > 0
