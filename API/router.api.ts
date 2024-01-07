export const API_URL = process.env.API_URL;
export const BASE_URL = process.env.BASE_URL;

import { omit } from "lodash";
import type { ID, URLQueryType } from "./types";

export { ID, URLQueryType };

export function getQueries<T>(query: URLQueryType<T>) {
  const filters = Object.entries(query?.filter ?? {}).map(([key, value]) =>
    key && value ? `filter.${key}=${value}` : ""
  );
  const omitFilter = omit(query, "filter");
  const queryArray = Object.entries(omitFilter).map(([key, value]) =>
    key && value ? `${key}=${value}` : ""
  );
  return [...filters, ...queryArray].join("&");
}

export const getUrlWithQuery = <T>(url: string, query: URLQueryType<T>) => {
  return `${url}?${getQueries(query)}`;
};

export const UsersApiRouters = {
  get: {
    classes_as_student: {
      value: (userId: ID, query?: URLQueryType<{}>) =>
        `${API_URL}/users/${userId}/classes/student?${getQueries(query ?? {})}`,
    },
    classes_as_teacher: {
      value: (userId: ID, query: URLQueryType<{}>) =>
        `${API_URL}/users/${userId}/classes/teacher?${getQueries(query)}`,
    },
    classes_as_owner: {
      value: (userId: ID, query: URLQueryType<{}>) =>
        `${API_URL}/users/${userId}/owned-classes?${getQueries(query)}`,
    },
    all_accounts: {
      value: (pageNumber: string) =>
        `${API_URL}/users?limit=10&page=${pageNumber}&sortBy=email:ASC`,
    },
  },
  post: {
    join_class_with_class_code: {
      value: `${API_URL}/classes/join-with-code`,
    },
    join_class_with_token: {
      value: `${API_URL}/classes/join-with-token`,
    },
    avatar: {
      value: `${API_URL}/auth/me/avatar`,
    },
  },
};

export const ClassesApiRouters = {
  get: {
    all_classes: {
      value: (pageNumber: string) =>
        `${API_URL}/classes?limit=10&page=${pageNumber}`,
    },
    class_details: {
      value: (classId: ID) => `${API_URL}/classes/${classId}`,
    },
    class_attendees: {
      value: (classId: ID) => `${API_URL}/classes/${classId}/attendees`,
    },
    class_grade_compositions: {
      value: (classId: ID) => `${API_URL}/classes/${classId}/compositions`,
    },
    students: {
      value: (classId: ID, query?: URLQueryType<{}>) =>
        `${API_URL}/classes/${classId}/students?${getQueries(query ?? {})}`,
    },
    grade_board: {
      value: (classId: ID) => `${API_URL}/classes/${classId}/grade-board`,
    },
    export_grade_board: {
      value: (classId: ID) => `${API_URL}/classes/${classId}/grade-board/csv`,
    },
    mapped_student_id: {
      value: (classId: ID) => `${API_URL}/classes/${classId}/map-student-id`,
    },
    student_grades: {
      value: (classId: ID, studentId: ID) =>
        `${API_URL}/classes/${classId}/students/${studentId}/grades`,
    },
    my_reviews: {
      value: (classId: ID, query?: URLQueryType<{}>) =>
        `${API_URL}/classes/${classId}/my-reviews?${getQueries(query ?? {})}`,
    },
    reviews: {
      value: (classId: ID, query?: URLQueryType<{}>) =>
        `${API_URL}/classes/${classId}/reviews?${getQueries(query ?? {})}`,
    },
  },
  post: {
    create_a_class: {
      value: `${API_URL}/classes`,
    },
    kick_attendee: {
      value: (classId: ID) => `${API_URL}/classes/${classId}/kick`,
    },
    upload_student_list: {
      value: (classId: ID) => `${API_URL}/classes/${classId}/students/upload`,
    },
  },
  patch: {
    update_class_details: {
      value: (classId: ID) => `${API_URL}/classes/${classId}`,
    },
    map_student: {
      value: (classId: ID) => `${API_URL}/classes/${classId}/map-student-id`,
    },
    unmap_student: {
      value: (classId: ID) => `${API_URL}/classes/${classId}/unmap-student-id`,
    },
    leave_class: {
      value: (classId: ID) => `${API_URL}/classes/${classId}/leave`,
    },
    restore_soft_deleted_class: {
      value: (classId: string) => `${API_URL}/classes/${classId}/restore`,
    },
    soft_delete_class: {
      value: (classId: string) => `${API_URL}/classes/${classId}/soft-delete`,
    },
    map_student_id: {
      value: (classId: string) =>
        `${API_URL}/classes/${classId}/map-student-id`,
    },
    unmap_student_id: {
      value: (classId: string) =>
        `${API_URL}/classes/${classId}/unmap-student-id`,
    },
  },
  delete: {
    delete_students_list: {
      value: (classId: ID) => `${API_URL}/classes/${classId}/students`,
    },
  },
};

export const CompositionsApiRouters = {
  post: {
    create_a_composition: {
      value: `${API_URL}/compositions`,
    },
  },
  patch: {
    update_a_composition: {
      value: (compositionId: ID) => `${API_URL}/compositions/${compositionId}`,
    },
    update_composition_order: {
      value: (compositionId: ID) =>
        `${API_URL}/compositions/${compositionId}/order`,
    },
    update_grade: {
      value: (compositionId: ID, studentId: ID) =>
        `${API_URL}/compositions/${compositionId}/students/${studentId}/grade`,
    },
    finalize: {
      value: (compositionId: ID) =>
        `${API_URL}/compositions/${compositionId}/finalize`,
    },
    upload_compositions_grade: {
      value: (compositionId: ID) =>
        `${API_URL}/compositions/${compositionId}/grades/upload`,
    },
  },
  delete: {
    delete_a_composition: {
      value: (compositionId: ID) => `${API_URL}/compositions/${compositionId}`,
    },
  },
};

export const GlobalApiRouters = {
  get: {
    templates_student_list: {
      value: `${BASE_URL}/api/static/templates/student-list.csv`,
    },
    templates_grades: {
      value: `${BASE_URL}/api/static/templates/grades.csv`,
    },
  },
};

export const ReviewApiRouters = {
  get: {
    review_comments: {
      value: (reviewId: ID) => `${API_URL}/reviews/${reviewId}/comments`,
    },
    review_comment_replies: {
      value: (reviewId: ID, commentId: ID) =>
        `${API_URL}/reviews/${reviewId}/comments/${commentId}/replies`,
    },
  },
  post: {
    create_review: {
      value: `${API_URL}/reviews`,
    },
    review_comment: {
      value: (reviewId: ID) => `${API_URL}/reviews/${reviewId}/comments`,
    },
    review_comment_reply: {
      value: (reviewId: ID, commentId: ID) =>
        `${API_URL}/reviews/${reviewId}/comments/${commentId}/reply`,
    },
  },
  patch: {
    update_review: {
      value: (reviewId: ID) => `${API_URL}/reviews/${reviewId}/status`,
    },
  },
};
