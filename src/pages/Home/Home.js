import Graph from "../../components/Graph";
import {useEffect, useState} from "react";
import { format } from 'date-fns';
import axios from "axios";
import ReactJson from 'react-json-view';

import {getServiceName} from "../../utils/serviceNames";

import css from './Home.css';

const Home = () => {
    const [logs, setLogs] = useState(null);
    const [openLogs, setOpenLogs] = useState([]);

    const fetchLogs = async () => {
        const response = await axios.get('https://us-central1-request-tracer.cloudfunctions.net/app/logs');

        setLogs(response.data.logs.map((x, i) => ({ ...x.log, id: response.data.logs[i].traceId })).filter(x => x && x.id));
    };

    useEffect(() => {
        fetchLogs();
    }, []);

    const handleLogClick = (id) => {
        setOpenLogs(openLogs.includes(id) ? openLogs.filter(x => x !== id) : [...openLogs, id]);
    };

    return (
        <div className={css.base}>
            <div className={css.graph}><Graph logs={logs || []} /></div>
            <div className={css.logs}>
                {logs?.map((log, index) => (
                    <div className={css.logContainer} key={index} onClick={() => handleLogClick(log.id)}>
                        <div className={css.logInfo}>
                            <div className={css.tagsContainer}>
                                <div className={css.timeTag}>{format(new Date(log.time), 'pp')}</div>
                                <div className={`${css.statusTag} ${log.status >= 400 ? css.errorStatus : ''}`}>{log.status}</div>
                                <div className={css.requestTag}>{log.method.toUpperCase()}</div>
                            </div>
                            <div className={css.logTitle}>{getServiceName(log.from)} -> {getServiceName(log.to)} ({log.url})</div>
                        </div>
                        <div className={`${css.logBody} ${openLogs.includes(log.id) ? css.open : ''}`}>
                            <ReactJson src={log} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Home;
