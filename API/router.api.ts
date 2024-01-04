export const API_URL = process.env.API_URL;
export const BASE_URL = process.env.BASE_URL;

export type URLQueryType<T> = {
  sortBy?: string | number;
  limit?: string | number;
  exclude?: string | number | null;
  page?: string | number;
} & T;

export type ID = string | number;

export const getQueries = <T>(query: URLQueryType<T>) => {
  const queryArray = Object.entries(query).map(([key, value]) =>
    key && value ? `${key}=${value}` : ""
  );
  return queryArray.join("&");
};

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
    }
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
