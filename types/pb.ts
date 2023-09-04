/**
 * This file was @generated using pocketbase-typegen
 */

export enum Collections {
  Book = "book",
  BookDetailed = "book_detailed",
  Format = "format",
  Publication = "publication",
  Publisher = "publisher",
  Release = "release",
  Review = "review",
  Staff = "staff",
  Title = "title",
  Users = "users",
  Work = "work",
}

// Alias types for improved usability
export type IsoDateString = string;
export type RecordIdString = string;
export type HTMLString = string;

// System fields
export type BaseSystemFields<T = never> = {
  id: RecordIdString;
  created: IsoDateString;
  updated: IsoDateString;
  collectionId: string;
  collectionName: Collections;
  expand?: T;
};

export type AuthSystemFields<T = never> = {
  email: string;
  emailVisibility: boolean;
  username: string;
  verified: boolean;
} & BaseSystemFields<T>;

// Record types for each collection

export type BookRecord<Tmetadata = unknown> = {
  cover?: string[];
  edition?: string;
  metadata?: null | Tmetadata;
  old_id?: string;
  price?: number;
  publication: RecordIdString;
  publishDate?: IsoDateString;
};

export type BookDetailedRecord = {
  baseCover?: string[];
  cover?: string[];
  digital?: boolean;
  edition?: string;
  name: string;
  price?: number;
  publishDate?: IsoDateString;
  publisher: RecordIdString;
  release: RecordIdString;
  title: RecordIdString;
  volume?: number;
};

export type FormatRecord = {
  color: string;
  decription?: HTMLString;
  name: string;
  slug: string;
  thumbnail?: string;
};

export type PublicationRecord<Tmetadata = unknown> = {
  cover?: string[];
  digital?: boolean;
  metadata?: null | Tmetadata;
  name: string;
  old_id?: string;
  release: RecordIdString;
  volume?: number;
};

export type PublisherRecord = {
  color: string;
  logo?: string;
  name: string;
  slug: string;
};

export enum ReleaseStatusOptions {
  "WAITING_FOR_APPROVAL" = "WAITING_FOR_APPROVAL",
  "REGISTERED" = "REGISTERED",
  "LICENSED" = "LICENSED",
  "ON_GOING" = "ON_GOING",
  "COMPLETED" = "COMPLETED",
  "HIATUS" = "HIATUS",
  "CANCELLED" = "CANCELLED",
}
export type ReleaseRecord = {
  name: string;
  old_id?: number;
  publisher: RecordIdString;
  status?: ReleaseStatusOptions;
  title: RecordIdString;
};

export type ReviewRecord = {
  content: HTMLString;
  header: string;
  release: RecordIdString;
  score?: number;
  user: RecordIdString;
};

export type StaffRecord = {
  name: string;
};

export type TitleRecord<Tmetadata = unknown> = {
  cover?: string;
  description?: HTMLString;
  format: RecordIdString;
  metadata?: null | Tmetadata;
  name: string;
};

export type UsersRecord = {
  avatar?: string;
  banner?: string;
  bio?: string;
  displayName?: string;
};

export type WorkRecord = {
  name: string;
  priority?: number;
  staff: RecordIdString;
  title: RecordIdString;
};

// Response types include system fields and match responses from the PocketBase API
export type BookResponse<Tmetadata = unknown, Texpand = unknown> = Required<
  BookRecord<Tmetadata>
> &
  BaseSystemFields<Texpand>;
export type BookDetailedResponse<Texpand = unknown> =
  Required<BookDetailedRecord> & BaseSystemFields<Texpand>;
export type FormatResponse<Texpand = unknown> = Required<FormatRecord> &
  BaseSystemFields<Texpand>;
export type PublicationResponse<
  Tmetadata = unknown,
  Texpand = unknown,
> = Required<PublicationRecord<Tmetadata>> & BaseSystemFields<Texpand>;
export type PublisherResponse<Texpand = unknown> = Required<PublisherRecord> &
  BaseSystemFields<Texpand>;
export type ReleaseResponse<Texpand = unknown> = Required<ReleaseRecord> &
  BaseSystemFields<Texpand>;
export type ReviewResponse<Texpand = unknown> = Required<ReviewRecord> &
  BaseSystemFields<Texpand>;
export type StaffResponse<Texpand = unknown> = Required<StaffRecord> &
  BaseSystemFields<Texpand>;
export type TitleResponse<Tmetadata = unknown, Texpand = unknown> = Required<
  TitleRecord<Tmetadata>
> &
  BaseSystemFields<Texpand>;
export type UsersResponse<Texpand = unknown> = Required<UsersRecord> &
  AuthSystemFields<Texpand>;
export type WorkResponse<Texpand = unknown> = Required<WorkRecord> &
  BaseSystemFields<Texpand>;

// Types containing all Records and Responses, useful for creating typing helper functions

export type CollectionRecords = {
  book: BookRecord;
  book_detailed: BookDetailedRecord;
  format: FormatRecord;
  publication: PublicationRecord;
  publisher: PublisherRecord;
  release: ReleaseRecord;
  review: ReviewRecord;
  staff: StaffRecord;
  title: TitleRecord;
  users: UsersRecord;
  work: WorkRecord;
};

export type CollectionResponses = {
  book: BookResponse;
  book_detailed: BookDetailedResponse;
  format: FormatResponse;
  publication: PublicationResponse;
  publisher: PublisherResponse;
  release: ReleaseResponse;
  review: ReviewResponse;
  staff: StaffResponse;
  title: TitleResponse;
  users: UsersResponse;
  work: WorkResponse;
};
