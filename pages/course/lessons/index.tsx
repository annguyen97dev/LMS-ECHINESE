import React from 'react';
import ExamReview from '~/components/Global/Exam/ExamReview/ExamReview';
import Lessions from '~/components/Global/Lessions/Lessions';
import LayoutBase from '~/components/LayoutBase';

const LessionPage = (props: any) => <Lessions courseID={props.courseID} />;
export default LessionPage;
