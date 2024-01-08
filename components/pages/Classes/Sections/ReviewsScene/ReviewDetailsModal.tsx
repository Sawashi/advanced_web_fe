import React from "react";
import { useGetReview } from "API/get/get.review.details";
import { observer } from "mobx-react";
import { useStores } from "hooks/useStores";
import ReviewModalTeacher from "./TeacherReviewsScene/ReviewModal";
import ReviewModalStudent from "./StudentReviewScene/ReviewModal";

type Props = {
  isVisible: boolean;
  onClose: () => void;
  reviewId: string;
};

const ReviewDetailsModal = ({ isVisible, onClose, reviewId }: Props) => {
  const { classStore } = useStores();
  const { isStudentOfClass } = classStore;
  const { data: review, isLoading: isReviewLoading } = useGetReview(reviewId);

  if (isReviewLoading || !review) {
    return null;
  }

  if (isStudentOfClass) {
    return (
      <ReviewModalStudent isVisible={isVisible} onClose={onClose} review={review} />
    );
  }

  return (
    <ReviewModalTeacher isVisible={isVisible} onClose={onClose} review={review} />
  );
};
export default observer(ReviewDetailsModal);
