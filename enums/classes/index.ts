export enum EClassRole {
  OWNER = "owner",
  TEACHER = "teacher",
  STUDENT = "student",
}

export enum ETabName {
  Stream = "stream",
  People = "people",
  Students = "students",
  GradeStructure = "grade-structure",
  GradeBoard = "grade-board",
  Reviews = "reviews",
}

export enum ETabDescription {
  Stream = "Stream",
  People = "People",
  Students = "Students",
  GradeStructure = "Grade Structure",
  GradeBoard = "Grade Board",
  Reviews = "Reviews",
}

export enum EReviewStatus {
  PENDING = "pending",
  REJECTED = "rejected",
  ACCEPTED = "accepted",
}

export enum ENotificationType {
  GRADE_COMPOSITION_FINALIZED = "GRADE_COMPOSITION_FINALIZED", // grade board
  GRADE_REVIEW_REQUESTED = "GRADE_REVIEW_REQUESTED", // review
  MARK_REVIEW_DECISION = "MARK_REVIEW_DECISION", // review
  COMMENT = "COMMENT", // review
  COMMENT_REPLY = "COMMENT_REPLY", // review
}
