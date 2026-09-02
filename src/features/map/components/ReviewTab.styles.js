import styled from "styled-components";

export const ReviewContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 24px 24px;
`;

export const RatingSummaryBox = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid #E0E0E0;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);

  .avg-rating {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border-right: 1px solid #E0E0E0;
    padding-right: 24px;
    margin-right: 24px;

    .star {
      color: #FFC107;
      font-size: 32px;
      margin-bottom: 8px;
    }
    .score {
      font-size: 32px;
      font-weight: 700;
    }
  }

  .rating-graph {
    flex: 1;
    height: 100px; /* recharts 높이 확보 */
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

export const ReviewWriteBox = styled.div`
  border: 1px solid #E0E0E0;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 24px;
  
  .header {
    display: flex;
    align-items: center;
    margin-bottom: 12px;
    h3 { margin: 0; font-size: 16px; margin-right: 12px; }
    .stars {
      color: #CCC;
      font-size: 20px;
      cursor: pointer;
      display: flex;
      gap: 4px;
      .active { color: #FFC107; }
    }
  }

    textarea {
      width: 100%;
      height: 80px;
      border: 1px solid #E0E0E0;
      border-radius: 8px;
      padding: 12px;
      resize: none;
      outline: none;
      font-family: inherit;
      margin-bottom: 12px;
      &:focus { border-color: #81D4FA; }
    }

  .bottom-actions {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;

    .left-col {
      display: flex;
      flex-direction: column;
      gap: 12px;

      .upload-btn {
        background-color: #999;
        color: #FFF;
        border: none;
        border-radius: 4px;
        padding: 6px 12px;
        font-size: 12px;
        cursor: pointer;
        width: fit-content;
      }

      .preview-box {
        position: relative;
        width: 120px;
        height: 80px;
        border-radius: 8px;
        overflow: hidden;

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .delete-preview {
          position: absolute;
          top: 4px;
          right: 4px;
          background: rgba(0,0,0,0.5);
          color: white;
          border: none;
          border-radius: 50%;
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          cursor: pointer;
        }
      }
    }

    .btn-group {
      display: flex;
      gap: 8px;
      
      button {
        padding: 8px 16px;
        border-radius: 6px;
        font-weight: bold;
        cursor: pointer;
        border: none;
      }
      .btn-cancel {
        background-color: #BDBDBD;
        color: #FFF;
      }
      .btn-submit {
        background-color: #81D4FA;
        color: #FFF;
      }
    }
  }
`;

export const ReviewList = styled.div`
  display: flex;
  flex-direction: column;
`;

export const ReviewItem = styled.div`
  border-bottom: 1px solid #E0E0E0;
  padding: 24px 0;
  
  .header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 12px;

    .user-info {
      display: flex;
      align-items: center;
      gap: 12px;
      
      img {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        object-fit: cover;
      }
      
      .meta {
        display: flex;
        flex-direction: column;
        
        .name-rating {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: bold;
          font-size: 15px;
          .rating {
            display: flex;
            align-items: center;
            color: #FFC107;
            font-size: 14px;
            gap: 4px;
          }
        }
        .date {
          font-size: 12px;
          color: #999;
          margin-top: 4px;
        }
      }
    }

    .edit-actions {
      font-size: 12px;
      color: #999;
      display: flex;
      align-items: center;
      gap: 12px;
      button {
        background: none;
        border: none;
        color: inherit;
        cursor: pointer;
        padding: 0;
        &:hover { color: #333; }
      }
      .delete-btn {
        color: #FF7043;
        &:hover { color: #E64A19; }
      }
    }
  }

  .content {
    font-size: 14px;
    line-height: 1.5;
    color: #333;
    margin-bottom: 12px;
    white-space: pre-wrap;
    .more-btn {
      color: #2196F3;
      cursor: pointer;
      font-weight: bold;
      margin-left: 4px;
    }
  }

  .attached-image {
    max-width: 240px;
    height: 140px;
    object-fit: cover;
    border-radius: 8px;
    margin-bottom: 12px;
    display: block;
  }

  .footer {
    display: flex;
    justify-content: flex-end;
    
    .like-btn {
      background-color: #81D4FA;
      color: #FFF;
      border: none;
      border-radius: 16px;
      padding: 6px 16px;
      font-size: 13px;
      display: flex;
      align-items: center;
      gap: 6px;
      cursor: pointer;
      font-weight: bold;
      &:hover { background-color: #4FC3F7; }
    }
  }
`;

export const LoadingMore = styled.div`
  display: flex;
  justify-content: center;
  padding: 24px 0;
  
  .more-btn {
    background-color: #E1F5FE;
    color: #0288D1;
    border: none;
    border-radius: 20px;
    padding: 10px 24px;
    font-size: 13px;
    font-weight: bold;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: background-color 0.2s;
    
    &:hover {
      background-color: #B3E5FC;
    }
  }
`;
