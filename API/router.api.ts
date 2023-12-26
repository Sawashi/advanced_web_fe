export const API_URL = process.env.API_URL;

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
  },
  post: {
    create_a_class: {
      value: `${API_URL}/classes`,
    },
    kick_attendee: {
      value: (classId: ID) => `${API_URL}/classes/${classId}/kick`,
    },
  },
  patch: {
    update_class_details: {
      value: (classId: ID) => `${API_URL}/classes/${classId}`,
    },
  },
};
